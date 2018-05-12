import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag';
import { RECORDS_LIST, NEW_RECORD_FORM } from '../constants/WidgetNames';

const EXP_TYPE = 'EXP';
const INC_TYPE = 'INC';
const DEFAULT_CURRENCY = 'CAD';

const DefaultState = () => {
    this.selectedTags = new Set();
    this.amount = '';
    this.type = EXP_TYPE;
    this.currency = DEFAULT_CURRENCY;

    return this;
};

const calc = text => {
    try {
        const evalResult = Number.parseFloat(eval(text));
        if (Number.isFinite(evalResult)) {
            return evalResult.toFixed(2);
        }
    } catch (_err) {}
};

class NewRecordForm extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        tags: PropTypes.array.isRequired,
        submit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.calculateButton = React.createRef();
        this.amountInput = React.createRef();

        this.state = new DefaultState();
    }

    calculate() {
        this.setState(prevState => {
            const amount = calc(prevState.amount) || '';
            return { ...prevState, amount };
        });

        this.focus();
    }

    toggleTag(name) {
        this.setState(prevState => {
            const newState = { ...prevState };

            if (prevState.selectedTags.has(name)) {
                newState.selectedTags.delete(name);
            } else {
                newState.selectedTags.add(name);
            }

            return newState;
        });
    }

    get tags() {
        return this.props.tags.map(name => (
            <Tag
                name={name}
                key={name}
                toggle={this.toggleTag.bind(this)}
                isSelected={this.state.selectedTags.has(name)}
            />
        ));
    }

    async submit(returnTo) {
        const data = {
            amount: {
                amount: this.state.amount,
                currency: this.state.currency,
            },
            transaction_type: this.state.type,
            tags: Array.from(this.state.selectedTags),
        };

        const success = await this.props.submit({ data, returnTo });
        // TODO: show valdation errors if any

        if (success) {
            this.reset();
        }
    }

    save() {
        return this.submit(RECORDS_LIST);
    }

    saveAddAnother() {
        return this.submit(NEW_RECORD_FORM);
    }

    reset() {
        this.setState(new DefaultState());
        this.focus();
    }

    handleAmountChange(event) {
        const amount = event.target.value;
        this.setState(prevState => ({ ...prevState, amount }));
    }

    handleTypeChange(event) {
        const type = event.target.value;
        this.setState(prevState => ({ ...prevState, type }));
    }

    componentDidUpdate(prevProps) {
        // if component just showed up:
        if (prevProps.isVisible === false && this.props.isVisible === true) {
            this.focus();
        }
    }

    componentDidMount() {
        this.focus();
    }

    focus() {
        this.amountInput.current.focus();
    }

    render() {
        return (
            <div id="newRecordForm" hidden={!this.props.isVisible}>
                <div className="row justify-content-center">
                    <h2>Add New Record</h2>
                </div>
                <form>
                    <div className="form-group">
                        <label htmlFor="newRecordAmount" className="bmd-label-static">
                            Amount
                        </label>
                        <div className="input-group">
                            <input
                                value={this.state.amount}
                                onChange={this.handleAmountChange.bind(this)}
                                ref={this.amountInput}
                                type="tel"
                                className="form-control"
                                autoComplete="off"
                                autoFocus
                            />
                            <span className="input-group-btn">
                                <button
                                    ref={this.calculateButton}
                                    onClick={this.calculate.bind(this)}
                                    className="btn btn-default"
                                    type="button">
                                    calculate
                                </button>
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="bmd-label-static">Tags</label>
                        <div id="tagsContainer" className="border border-light">
                            {this.tags}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newRecordTransactionType" className="bmd-label-static">
                            Transaction type
                        </label>
                        <div className="input-group">
                            <select
                                name="transaction_type"
                                className="form-control"
                                value={this.state.type}
                                onChange={this.handleTypeChange.bind(this)}>
                                <option value={EXP_TYPE}>Expences</option>
                                <option value={INC_TYPE}>Income</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="form-group">
                    <button onClick={this.save.bind(this)} className="btn btn-success btn-default">
                        Save
                    </button>
                    <button onClick={this.saveAddAnother.bind(this)} className="btn btn-default">
                        Save and add another
                    </button>
                </div>
            </div>
        );
    }
}

export default NewRecordForm;

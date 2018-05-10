import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag';

// TODO: implement save and add another

class NewRecordForm extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        tags: PropTypes.array.isRequired,
        submit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.calculateButton = React.createRef();
        this.saveButton = React.createRef();
        this.saveAddAnotherButton = React.createRef();
        this.amountInput = React.createRef();
        this.transactionTypeSelect = React.createRef();

        this.state = { selectedTags: {} };
    }

    calculate() {
        const input = this.amountInput.current;
        let result;

        try {
            result = Number.parseFloat(eval(input.value));
        } catch (e) {
            input.value = '';
        }

        if (Number.isFinite(result)) {
            input.value = result.toFixed(2);
        }

        input.focus();
    }

    toggleTag(name) {
        this.setState(prevState => {
            const isSelected = Boolean(prevState.selectedTags[name]);
            const newState = { ...prevState };

            if (true === isSelected) {
                delete newState.selectedTags[name];
            } else {
                newState.selectedTags[name] = true;
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
                isSelected={Boolean(this.state.selectedTags[name])}
            />
        ));
    }

    async save() {
        const data = {
            amount: {
                amount: this.amountInput.current.value,
                currency: 'CAD',
            },
            transaction_type: this.transactionTypeSelect.current.value,
            tags: Object.keys(this.state.selectedTags),
        };

        const success = await this.props.submit(data);
        // TODO: show valdation errors if any

        if (success) {
            this.reset();
        }
    }

    reset() {
        this.amountInput.current.value = '';
        this.transactionTypeSelect.current.value = 'EXP';
        this.setState(prevState => {
            const newState = { ...prevState };
            newState.selectedTags = {};
            return newState;
        });
    }

    render() {
        return (
            <div className="records-list" hidden={!this.props.isVisible}>
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
                                ref={this.transactionTypeSelect}
                                name="transaction_type"
                                className="form-control"
                                defaultValue="EXP">
                                <option value="EXP">Expences</option>
                                <option value="INC">Income</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="form-group">
                    <button
                        ref={this.saveButton}
                        onClick={this.save.bind(this)}
                        className="btn btn-success btn-default">
                        Save
                    </button>
                    <button ref={this.saveAddAnotherButton} className="btn btn-default">
                        Save and add another
                    </button>
                </div>
            </div>
        );
    }
}

export default NewRecordForm;

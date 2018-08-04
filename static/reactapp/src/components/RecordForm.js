// @flow
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import * as Actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Tag from './Tag';
import { EXP, INC } from '../constants/TransactionTypes';

import RecordModel from '../models/Record';
import calc from '../utils/calc';

import { submitRecordForm } from '../actions';

type Props = {
    tags: Array<string>,
    actions: { submitRecordForm: typeof submitRecordForm },
    history: any, // TODO: add history type
};

type State = { record: RecordModel };

class RecordForm extends Component<Props, State> {
    amountInput: { current: any };
    record: RecordModel;

    constructor(props) {
        super(props);

        if ('/records/new' === props.match.path) {
            this.state = { record: RecordModel.default() };
        } else {
            this.state = { record: new RecordModel(props.record) };
        }
        this.amountInput = React.createRef();
    }

    get record() {
        return this.state.record;
    }

    get tags() {
        return this.props.tags.map(name => (
            <Tag
                name={name}
                key={name}
                toggle={this.handleToggleTag.bind(this)}
                isSelected={this.record.selectedTags.has(name)}
            />
        ));
    }

    async submit(saveAddAnother = false) {
        const success = await this.props.actions.submitRecordForm(this.record);
        // TODO: show valdation errors if any

        if (success) {
            if (saveAddAnother) {
                this.setState(prevState => {
                    return { ...prevState, record: RecordModel.default() };
                });
                this.focus();
            } else {
                this.props.history.push('/records');
            }
        }
    }

    handleAmountChange(event) {
        const value = event.target.value;
        this.setState(prevState => {
            const record = new RecordModel(prevState.record);
            record.amount.amount = value;
            return { ...prevState, record };
        });
    }

    handleTypeChange(event) {
        const value = event.target.value;
        this.setState(prevState => {
            const record = new RecordModel(prevState.record);
            record.transaction_type = value;
            return { ...prevState, record };
        });
    }

    handleToggleTag(name) {
        this.setState(prevState => {
            const record = new RecordModel(prevState.record);
            record.toggleTag(name);
            return { ...prevState, record };
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    calculateAmount() {
        this.setState(
            (prevState: State): State => {
                const newState: State = { ...prevState };
                const amount = calc(prevState.record.amount.amount);

                if (null !== amount) {
                    const record = new RecordModel(prevState.record);
                    record.amount.amount = amount;
                    newState.record = record;
                }

                return newState;
            }
        );
    }

    componentDidMount() {
        this.focus();
    }

    focus() {
        this.amountInput.current.focus();
    }

    get headerText(): string {
        return this.record && this.record.isPersisted ? 'Edit Record' : 'Add New Record';
    }

    render() {
        return (
            <div id="newRecordForm">
                <div className="row justify-content-center">
                    <h2>{this.headerText}</h2>
                </div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="newRecordAmount" className="bmd-label-static">
                            Amount
                        </label>
                        <div className="input-group">
                            <input
                                value={this.record.amount.amount}
                                onChange={this.handleAmountChange.bind(this)}
                                ref={this.amountInput}
                                type="tel"
                                className="form-control"
                                autoComplete="off"
                                autoFocus
                            />
                            <span className="input-group-btn">
                                <button
                                    onClick={this.calculateAmount.bind(this)}
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
                                value={this.record.transaction_type}
                                onChange={this.handleTypeChange.bind(this)}>
                                <option value={EXP}>Expences</option>
                                <option value={INC}>Income</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="form-group">
                    <button onClick={() => this.submit()} className="btn btn-success btn-default">
                        Save
                    </button>
                    <button onClick={() => this.submit(true)} className="btn btn-default">
                        Save & Add
                    </button>
                    <button onClick={this.props.history.goBack} className="btn btn-info">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ tags: state.auth.profile.tags });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch),
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(RecordForm)
);

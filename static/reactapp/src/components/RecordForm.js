// @flow

import React, { Component } from 'react';

import Tag from './Tag';
import { EXP, INC } from '../constants/TransactionTypes';

import RecordModel from '../models/Record';
import calc from '../utils/calc';

import { submitRecordForm } from '../actions';

import type { RouterHistory } from 'react-router-dom';
import type { Attrs } from '../types/Record';

type Props = {
    tags: Array<string>,
    submit: typeof submitRecordForm,
    history: RouterHistory,
    attrs: Attrs,
};

type State = {
    record: RecordModel,
    amount: string,
};

const initState = (props: Props): State => {
    const record = RecordModel.from(props.attrs);
    const amount = 0 === record.amount ? '' : String(record.amount);

    return { record, amount };
};

export default class RecordForm extends Component<Props, State> {
    amountInput: { current: null | HTMLInputElement };

    constructor(props: Props): void {
        super(props);

        this.state = initState(this.props);
        this.amountInput = React.createRef();
    }

    get record(): RecordModel {
        return this.state.record;
    }

    get tags() {
        return this.props.tags.map(name => (
            <Tag
                name={name}
                key={name}
                toggle={this.handleToggleTag.bind(this)}
                isSelected={this.record.tags.has(name)}
            />
        ));
    }

    submit(saveAddAnother: boolean = false) {
        this.setState((prevState: State) => {
            const amount = calc(prevState.amount);

            if (amount !== null) {
                const record = prevState.record.clone();
                record.amount = parseFloat(prevState.amount);

                // TODO: show valdation errors if any
                this.props.submit(record).then(success => {
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
                });
            }
        });
    }

    handleAmountChange(event: SyntheticInputEvent<HTMLInputElement>): void {
        const amount = event.target.value;
        this.setState(prevState => {
            return { ...prevState, amount };
        });
    }

    handleTypeChange(event: SyntheticInputEvent<HTMLInputElement>): void {
        const value = event.target.value;
        this.setState(prevState => {
            const record = prevState.record.clone();
            record.transaction_type = value;
            return { ...prevState, record };
        });
    }

    handleToggleTag(name: string): void {
        this.setState(prevState => {
            const record = prevState.record.clone();
            record.toggleTag(name);
            return { ...prevState, record };
        });
    }

    handleSubmit(event: SyntheticEvent<HTMLFormElement>): void {
        event.preventDefault();
    }

    calculateAmount() {
        this.setState(
            (prevState: State): State => {
                const newState: State = { ...prevState };
                const amount = calc(prevState.amount);

                if (null !== amount) {
                    newState.amount = amount;
                }

                return newState;
            }
        );
    }

    componentDidMount() {
        this.focus();
    }

    focus() {
        const input = this.amountInput.current;
        if (input) input.focus();
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
                                id="record-form-amount"
                                name="amount"
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
                    <button
                        id="save-record"
                        onClick={() => this.submit()}
                        className="btn btn-success btn-default">
                        Save
                    </button>
                    <button
                        id="save-add-another-record"
                        onClick={() => this.submit(true)}
                        className="btn btn-default">
                        Save & Add
                    </button>
                    <button
                        id="record-form-cancel"
                        onClick={this.props.history.goBack}
                        className="btn btn-info">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}

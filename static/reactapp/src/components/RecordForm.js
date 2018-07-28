import React, { Component } from 'react';
import * as Actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Tag from './Tag';
import { RECORDS_LIST, RECORD_FORM } from '../constants/WidgetNames';
import { EXP, INC } from '../constants/TransactionTypes';

import RecordModel from '../models/Record';

class RecordForm extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        tags: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);

        this.calculateButton = React.createRef();
        this.amountInput = React.createRef();
    }

    get record() {
        return this.props.recordForm.record;
    }

    calculate() {
        this.props.actions.calculateRecordFormAmount();
        this.focus();
    }

    get tags() {
        return this.props.tags.map(name => (
            <Tag
                name={name}
                key={name}
                toggle={this.props.actions.toggleRecordFormTag}
                isSelected={this.record.selectedTags.has(name)}
            />
        ));
    }

    async submit(returnTo) {
        const success = await this.props.actions.submitRecordForm(returnTo);
        // TODO: show valdation errors if any

        if (success) {
            this.reset();
        }
    }

    save() {
        return this.submit(RECORDS_LIST);
    }

    saveAddAnother() {
        return this.submit(RECORD_FORM);
    }

    reset() {
        this.setState(RecordModel.default());
        this.focus();
    }

    handleAmountChange(event) {
        this.props.actions.setRecordFormAmount(event.target.value);
    }

    handleTypeChange(event) {
        this.props.actions.setRecordFormTransactionType(event.target.value);
    }

    componentDidUpdate(prevProps) {
        const justShowedUp = prevProps.isVisible === false && this.props.isVisible === true;
        const amountChanged =
            prevProps.recordForm.record.amount.amount !== this.record.amount.amount;

        if (justShowedUp || amountChanged) {
            this.focus();
        }
    }

    componentDidMount() {
        this.focus();
    }

    focus() {
        this.amountInput.current.focus();
    }

    cancel() {
        this.props.actions.selectWidget(RECORDS_LIST);
    }

    get headerText() {
        return this.record && this.record.isPersisted ? 'Edit Record' : 'Add New Record';
    }

    render() {
        return (
            <div id="newRecordForm" hidden={!this.props.isVisible}>
                <div className="row justify-content-center">
                    <h2>{this.headerText}</h2>
                </div>
                <form>
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
                                    ref={this.calculateButton}
                                    onClick={this.props.actions.calculateRecordFormAmount}
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
                    <button onClick={this.save.bind(this)} className="btn btn-success btn-default">
                        Save
                    </button>
                    <button
                        onClick={this.saveAddAnother.bind(this)}
                        className="btn btn-default"
                        hidden={!this.record.isPersisted}>
                        Save & Add
                    </button>
                    {/* <button className="btn btn-danger" hidden={!this.isPersisted}> */}
                    {/*     Delete */}
                    {/* </button> */}
                    <button onClick={this.cancel.bind(this)} className="btn btn-info">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ recordForm: state.recordForm });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordForm);

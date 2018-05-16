import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EXP } from '../constants/TransactionTypes';
import RecordModel from '../models/Record';

const DATETIME_FORMAT_OPTIONS = {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

const fmtNum = input => Number.parseFloat(input, 10).toFixed(2);

class Record extends Component {
    static propTypes = {
        editRecord: PropTypes.func.isRequired,
        model: PropTypes.object.isRequired,
    };

    get model() {
        return this.props.model;
    }

    get amount() {
        return fmtNum(this.model.amount.amount);
    }

    get className() {
        const suffix = this.props.model.transaction_type === EXP ? 'warning' : 'success';
        return `card record-item bd-callout bd-callout-${suffix}`;
    }

    get tags() {
        return Object.values(this.props.model.tags).join(', ');
    }

    get date() {
        const fixInMinutes = 60;
        const offsetInSeconds = (new Date().getTimezoneOffset() + fixInMinutes) * 60;
        const localTimeInSeconds = this.props.model.created_at - offsetInSeconds;
        const date = new Date(localTimeInSeconds * 1000);
        return date.toLocaleString('en', DATETIME_FORMAT_OPTIONS);
    }

    startEdit() {
        const model = new RecordModel(this.props.model);
        this.props.editRecord(model);
    }

    render() {
        const startEdit = this.startEdit.bind(this);
        return (
            <div className={this.className} onClick={startEdit}>
                <div className="card-body">
                    <h5 className="text-center">
                        <span className="amount font-weight-bold float-left">{this.amount}</span>
                        <small className="date">{this.date}</small>
                        <span className="tags badge badge-info float-right">{this.tags}</span>
                    </h5>
                </div>
            </div>
        );
    }
}

export default Record;

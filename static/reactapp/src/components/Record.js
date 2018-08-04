// @flow

import React, { Component } from 'react';
import { EXP } from '../constants/TransactionTypes';

import RecordModel from '../models/Record';
import type { RouterHistory } from 'react-router-dom';

const DATETIME_FORMAT_OPTIONS = {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

const fmtNum = (input: string): string => Number.parseFloat(input).toFixed(2);

type Props = {
    model: RecordModel,
    history: RouterHistory,
};

class Record extends Component<Props, void> {
    get amount() {
        return fmtNum(this.props.model.amount.amount);
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

    edit() {
        this.props.history.push(`/records/${this.props.model.id}`);
    }

    render() {
        return (
            <div className={this.className} onClick={this.edit.bind(this)}>
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

import React, { Component } from 'react';

const DATETIME_FORMAT_OPTIONS = {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

const fmtNum = input => Number.parseFloat(input, 10).toFixed(2);

class Record extends Component {
    constructor(props) {
        super(props);

        this.data = props.data;
    }

    get amount() {
        return fmtNum(this.data.amount.amount);
    }

    get className() {
        const suffix = this.data.transaction_type === 'EXP' ? 'warning' : 'success';
        return `card record-item bd-callout bd-callout-${suffix}`;
    }

    get tags() {
        return Object.values(this.data.tags).join(', ');
    }

    get date() {
        const offset = new Date().getTimezoneOffset() * 60 * 1000;
        const date = new Date(this.data.created_at * 1000 - offset);
        return date.toLocaleString('en', DATETIME_FORMAT_OPTIONS);
    }

    render() {
        return (
            <div className={this.className}>
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

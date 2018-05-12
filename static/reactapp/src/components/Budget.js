import React, { Component } from 'react';
import PropTypes from 'prop-types';

// TODO: DRY
const fmtNum = input => Number.parseFloat(input, 10).toFixed(2);

class Budget extends Component {
    static propTypes = {
        attrs: PropTypes.object.isRequired,
    };

    get progress() {
        return Math.round(this.props.attrs.spent / this.props.attrs.amount * 100);
    }

    get averagePerDay() {
        return fmtNum(this.props.attrs.average_per_day);
    }

    get left() {
        return fmtNum(this.props.attrs.left);
    }

    get total() {
        return fmtNum(this.props.attrs.amount);
    }

    render() {
        return (
            <div className="card budget">
                <div className="card-body">
                    <div>
                        <span className="mr-auto">
                            <h5>{this.props.attrs.name}</h5>
                        </span>
                        <span className="float-right">
                            <small>left </small>
                            <span>{this.averagePerDay}</span>
                            <small> / day</small>
                        </span>
                    </div>
                    <span>left </span>
                    <big>{this.left}</big>
                    <span> of </span>
                    <big>{this.total}</big>
                </div>
                <div className="progress position-relative">
                    <div
                        className="progress-bar bg-lime"
                        role="progressbar"
                        style={{ width: `${this.progress}%` }}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </div>
            </div>
        );
    }
}

export default Budget;

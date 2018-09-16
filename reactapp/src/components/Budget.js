// @flow

import React, { Component } from 'react'
import { fmtNum } from '../utils'

import type { Attrs } from '../types/Budget'

export default class Budget extends Component<{| attrs: Attrs |}, void> {
    get progress() {
        const amount = parseFloat(this.props.attrs.amount)
        return Math.round((this.props.attrs.spent / amount) * 100)
    }

    get leftAveragePerDay() {
        return fmtNum(this.props.attrs.left_average_per_day)
    }

    get left() {
        return fmtNum(this.props.attrs.left)
    }

    get total() {
        return fmtNum(this.props.attrs.amount)
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
                            <span>{this.leftAveragePerDay}</span>
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
        )
    }
}

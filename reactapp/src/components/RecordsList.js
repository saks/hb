// @flow

import React, { Component } from 'react'

import RecordModel from '../models/Record'
import Record from './Record'

import type { RouterHistory } from 'react-router-dom'
import type { Attrs } from '../types/Record'
import type { ThunkAction } from '../types/Action'

type Props = {
    list: Array<Attrs>,
    currentPage: number,
    visitNextPage: () => ThunkAction,
    visitPrevPage: () => ThunkAction,
    history: RouterHistory,
}

export default class RecordsList extends Component<Props, void> {
    get renderedRecords() {
        return this.props.list.map(attrs => {
            const model = RecordModel.from(attrs)
            return <Record model={model} key={model.id} history={this.props.history} />
        })
    }

    render() {
        return (
            <div className="records-list">
                <div className="row justify-content-center">
                    <h2>Last Records</h2>
                </div>
                <div className="records">{this.renderedRecords}</div>
                <div className="container">
                    <nav aria-label="pagination">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <span
                                    className="page-link visit-prev-page"
                                    tabIndex="-1"
                                    onClick={this.props.visitPrevPage}
                                >
                                    Previous
                                </span>
                            </li>
                            <li className="page-item">
                                <span className="page-link current-page-number">
                                    {this.props.currentPage}
                                </span>
                            </li>
                            <li className="page-item">
                                <span
                                    className="page-link visit-next-page"
                                    onClick={this.props.visitNextPage}
                                >
                                    Next
                                </span>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        )
    }
}

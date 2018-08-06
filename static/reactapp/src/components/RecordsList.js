// @flow

import React, { Component } from 'react';

import RecordModel from '../models/Record';
import Record from './Record';

import type { RouterHistory } from 'react-router-dom';
import type { RecordAttrs } from '../types/Data';

type Props = {
    list: Array<RecordAttrs>,
    currentPage: number,
    visitNextPage: () => void,
    visitPrevPage: () => void,
    history: RouterHistory,
};

export default class RecordsList extends Component<Props, void> {
    get renderedRecords() {
        return this.props.list.map(attrs => {
            const model = RecordModel.from(attrs);
            return <Record model={model} key={model.id} history={this.props.history} />;
        });
    }

    render() {
        return (
            <div className="records-list">
                <div className="row justify-content-center">
                    <h2>Last Records</h2>
                </div>
                <div>{this.renderedRecords}</div>
                <div className="container">
                    <nav aria-label="pagination">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <a
                                    className="page-link"
                                    tabIndex="-1"
                                    onClick={this.props.visitPrevPage}>
                                    Previous
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link">{this.props.currentPage}</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" onClick={this.props.visitNextPage}>
                                    Next
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

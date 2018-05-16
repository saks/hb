import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RecordModel from '../models/Record';
import Record from './Record';

class RecordsList extends Component {
    static propTypes = {
        list: PropTypes.array.isRequired,
        currentPage: PropTypes.number.isRequired,
        isVisible: PropTypes.bool.isRequired,
        visitNextPage: PropTypes.func.isRequired,
        visitPrevPage: PropTypes.func.isRequired,
        editRecord: PropTypes.func.isRequired,
    };

    get renderedRecords() {
        return this.props.list.map(attrs => {
            const model = new RecordModel(attrs);
            return <Record model={model} key={model.id} editRecord={this.props.editRecord} />;
        });
    }

    render() {
        return (
            <div className="records-list" hidden={!this.props.isVisible}>
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

export default RecordsList;

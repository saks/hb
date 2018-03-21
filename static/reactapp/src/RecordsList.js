import React, { Component } from 'react';

import Record from './Record';
import Auth from './Auth';

class RecordsList extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);

        this.state = { currentPage: this.storedCurrentPage, records: [] };
    }

    initCurrentPage() {
        if (Number.isNaN(this.currentPage)) {
            this.currentPage = 1;
        }
    }

    get storedCurrentPage() {
        const stored = parseInt(localStorage.getItem('CURRENT_PAGE'), 10);
        return Number.isNaN(stored) ? 1 : stored;
    }

    set currentPage(n) {
        localStorage.setItem('CURRENT_PAGE', n);
    }

    async componentDidMount() {
        await this.show(this.state.currentPage);
    }

    async show(pageNum) {
        const records = await this.getPage(pageNum);
        if (undefined === records.results) {
            return;
        }

        this.setState({ records: records.results, currentPage: pageNum });
        this.currentPage = pageNum;
    }

    async getPage(pageNum) {
        this.props.showSpinner();
        const response = await Auth.fetch(`/api/records/record-detail/?page=${pageNum}`);
        this.props.hideSpinner();
        return response.json();
    }

    async nextPage() {
        this.show(this.state.currentPage + 1);
    }

    async prevPage() {
        if (1 === this.state.currentPage) {
            return;
        }
        this.show(this.state.currentPage - 1);
    }

    render() {
        return (
            <div className="records-list">
                <div className="row justify-content-center">
                    <h2>Last Records</h2>
                </div>
                <div>
                    {this.state.records.map(record => <Record data={record} key={record.id} />)}
                </div>
                <div className="container">
                    <nav aria-label="pagination">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <a className="page-link" tabIndex="-1" onClick={this.prevPage}>
                                    Previous
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link">{this.state.currentPage}</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" onClick={this.nextPage}>
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

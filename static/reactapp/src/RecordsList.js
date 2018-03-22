import React, { Component } from 'react';

import Record from './Record';
import Auth from './Auth';

class RecordsList extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.visitNextPage = this.visitNextPage.bind(this);
        this.visitPrevPage = this.visitPrevPage.bind(this);

        this.state = { currentPage: this.storedCurrentPage, records: [] };

        // base:
        this.registerContainer = this.registerContainer.bind(this);
    }

    // start of base functionality
    registerContainer(element) {
        this.container = element;
    }

    show() {
        this.container.removeAttribute('hidden');
    }

    hide() {
        this.container.setAttribute('hidden', true);
    }
    // end of base functionality

    initCurrentPage() {
        if (Number.isNaN(this.currentPage)) {
            this.storeCurrentPage(1);
        }
    }

    get storedCurrentPage() {
        const stored = parseInt(localStorage.getItem('CURRENT_PAGE'), 10);
        return Number.isNaN(stored) ? 1 : stored;
    }

    storeCurrentPage(n) {
        localStorage.setItem('CURRENT_PAGE', n);
    }

    async componentDidMount() {
        console.log(`mount ${this.constructor.name}`);
        await this.showPage(this.state.currentPage);
    }

    async showPage(pageNum) {
        const records = await this.getPage(pageNum);
        if (undefined === records.results) {
            return;
        }
        this.setState({ records: records.results, currentPage: pageNum });
        this.storeCurrentPage(pageNum);
    }

    async getPage(pageNum) {
        this.props.showSpinner();
        const response = await Auth.fetch(`/api/records/record-detail/?page=${pageNum}`);
        this.props.hideSpinner();
        return response.json();
    }

    async visitNextPage() {
        this.showPage(this.state.currentPage + 1);
    }

    async visitPrevPage() {
        if (1 === this.state.currentPage) {
            return;
        }
        this.showPage(this.state.currentPage - 1);
    }

    get renderedRecords() {
        return this.state.records.map(record => <Record data={record} key={record.id} />);
    }

    async componentWillReceiveProps(nextProps) {
        if (!this.props.isSignedIn && nextProps.isSignedIn) {
            await this.showPage(this.state.currentPage);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!this.props.isSignedIn) {
            return false;
        }

        if (0 === nextState.records.length && 0 === this.state.records.length) {
            return false;
        }

        return true;
    }

    render() {
        // console.log(`RENDER: ${this.constructor.name}`);
        // console.log(this.state);
        // console.log(this.props);
        // console.log('\n');

        return (
            <div className="records-list" ref={this.registerContainer} hidden>
                <div className="row justify-content-center">
                    <h2>Last Records</h2>
                </div>
                <div>{this.renderedRecords}</div>
                <div className="container">
                    <nav aria-label="pagination">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <a className="page-link" tabIndex="-1" onClick={this.visitPrevPage}>
                                    Previous
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link">{this.state.currentPage}</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" onClick={this.visitNextPage}>
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

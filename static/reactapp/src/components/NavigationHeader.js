import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NEW_RECORD_FORM, RECORDS_LIST, BUDGETS_LIST } from '../constants/WidgetNames';

class NavigationItem extends Component {
    constructor(props) {
        super(props);
        this.widgetName = this.props.widgetName;
    }

    get isActive() {
        return this.widgetName === this.props.selectedWidget;
    }

    get className() {
        return `nav-link text-white${this.isActive ? ' active' : ''}`;
    }

    handleClick() {
        this.props.selectWidget(this.widgetName);
    }

    render() {
        const handleClick = this.handleClick.bind(this);

        return (
            <li className="nav-item">
                <a className={this.className} data-target={this.widgetName} onClick={handleClick}>
                    {this.props.children}
                </a>
            </li>
        );
    }
}

class NewRecordFormItem extends NavigationItem {}
class RecordsListItem extends NavigationItem {}
class BudgetsPageItem extends NavigationItem {}

class NavigationHeader extends Component {
    static propTypes = {
        selectWidget: PropTypes.func.isRequired,
        selectedWidget: PropTypes.string.isRequired,
    };

    render() {
        return (
            <header className="navbar navbar-expand navbar-dark bg-info mb-3 py-0">
                <a className="navbar-brand mr-auto text-white" href="/static/app/index.html">
                    Octo Budget
                </a>
                <ul className="nav justify-content-end nav-tabs">
                    <NewRecordFormItem
                        selectWidget={this.props.selectWidget}
                        selectedWidget={this.props.selectedWidget}
                        widgetName={NEW_RECORD_FORM}>
                        <svg
                            height="24"
                            className="octicon octicon-plus"
                            viewBox="0 0 12 16"
                            version="1.1"
                            width="24"
                            aria-hidden="true">
                            <path fillRule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5z" />
                        </svg>
                    </NewRecordFormItem>
                    <RecordsListItem
                        selectWidget={this.props.selectWidget}
                        selectedWidget={this.props.selectedWidget}
                        widgetName={RECORDS_LIST}>
                        <svg
                            height="24"
                            className="octicon octicon-list-unordered"
                            viewBox="0 0 12 16"
                            version="1.1"
                            width="24"
                            aria-hidden="true">
                            <path
                                fillRule="evenodd"
                                d="M2 13c0 .59 0 1-.59 1H.59C0 14 0 13.59 0 13c0-.59 0-1 .59-1h.81c.59 0 .59.41.59 1H2zm2.59-9h6.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1H4.59C4 2 4 2.41 4 3c0 .59 0 1 .59 1zM1.41 7H.59C0 7 0 7.41 0 8c0 .59 0 1 .59 1h.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1h.01zm0-5H.59C0 2 0 2.41 0 3c0 .59 0 1 .59 1h.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1h.01zm10 5H4.59C4 7 4 7.41 4 8c0 .59 0 1 .59 1h6.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1h.01zm0 5H4.59C4 12 4 12.41 4 13c0 .59 0 1 .59 1h6.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1h.01z"
                            />
                        </svg>
                    </RecordsListItem>
                    <BudgetsPageItem
                        selectWidget={this.props.selectWidget}
                        selectedWidget={this.props.selectedWidget}
                        widgetName={BUDGETS_LIST}>
                        <svg
                            height="24"
                            className="octicon octicon-graph"
                            viewBox="0 0 16 16"
                            version="1.1"
                            width="24"
                            aria-hidden="true">
                            <path
                                fillRule="evenodd"
                                d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z"
                            />
                        </svg>
                    </BudgetsPageItem>
                </ul>
            </header>
        );
    }
}

export default NavigationHeader;

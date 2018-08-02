import { NavLink } from 'react-router-dom';
import React from 'react';

const NavigationHeader = () => (
    <header className="navbar navbar-expand navbar-dark bg-info mb-3 py-0">
        <a className="navbar-brand mr-auto text-white" href="/static/reactapp/build/index.html">
            Octo Budget
        </a>
        <ul className="nav justify-content-end nav-tabs">
            <li className="nav-item">
                <NavLink
                    activeClassName="active"
                    className="nav-link text-white"
                    to="/records"
                    exact={true}>
                    <ListIcon />
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                    activeClassName="active"
                    className="nav-link text-white"
                    to="/budgets"
                    exact={true}>
                    <GraphIcon />
                </NavLink>
            </li>
        </ul>
    </header>
);

const ListIcon = () => (
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
);

const GraphIcon = () => (
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
);

export default NavigationHeader;

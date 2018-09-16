// @flow

import { NavLink } from 'react-router-dom'
import React from 'react'
import GraphIcon from './GraphIcon'
import ListIcon from './ListIcon'
import TagsIcon from './TagsIcon'

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
                    exact
                >
                    <ListIcon />
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                    activeClassName="active"
                    className="nav-link text-white"
                    to="/budgets"
                    exact
                >
                    <GraphIcon />
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link text-white" to="/tags" exact>
                    <TagsIcon />
                </NavLink>
            </li>
        </ul>
    </header>
)

export default NavigationHeader

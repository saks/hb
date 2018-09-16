// @flow

import React, { Component } from 'react'

import Budget from './Budget'
import type { Attrs } from '../types/Budget'

export default class Budgets extends Component<{| list: Array<Attrs> |}> {
    get budgets() {
        return this.props.list.map(attrs => <Budget attrs={attrs} key={attrs.name} />)
    }

    render() {
        return (
            <div id="budgets">
                <div className="row justify-content-center">
                    <h2>Budgets</h2>
                </div>
                <div id="budget-cards">{this.budgets}</div>
            </div>
        )
    }
}

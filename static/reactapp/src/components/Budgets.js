import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Budget from './Budget';

class Budgets extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        list: PropTypes.array.isRequired,
    };

    get budgets() {
        return this.props.list.reverse().map(attrs => <Budget attrs={attrs} key={attrs.name} />);
    }

    render() {
        return (
            <div className="records-list" hidden={!this.props.isVisible}>
                <div className="row justify-content-center">
                    <h2>Budgets</h2>
                </div>
                <div id="budget-cards">{this.budgets}</div>
            </div>
        );
    }
}

export default Budgets;
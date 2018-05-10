import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tag extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        toggle: PropTypes.func.isRequired,
        isSelected: PropTypes.bool.isRequired,
    };

    onClick() {
        this.props.toggle(this.props.name);
    }

    get className() {
        const postfix = this.props.isSelected ? 'danger' : 'info';
        return `btn btn-outline-${postfix}`;
    }

    render() {
        return (
            <div className={this.className} onClick={this.onClick.bind(this)}>
                {this.props.name}
            </div>
        );
    }
}

export default Tag;

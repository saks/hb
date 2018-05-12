import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Spinner extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
    };

    render() {
        return (
            <div className="loader" hidden={!this.props.isVisible}>
                <svg viewBox="0 0 32 32" width="32" height="32">
                    <circle id="spinner" cx="16" cy="16" r="14" fill="none" />
                </svg>
            </div>
        );
    }
}

export default Spinner;

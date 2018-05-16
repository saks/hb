import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PlusIcon from '../components/PlusIcon';
import Record from '../models/Record';

export default class AddRecordButton extends Component {
    static propTypes = {
        editRecord: PropTypes.func.isRequired,
        isVisible: PropTypes.bool.isRequired,
    };

    handleClick() {
        this.props.editRecord(Record.default());
    }

    render() {
        return (
            <div id="add-button" className="position-fixed" hidden={!this.props.isVisible}>
                <button
                    type="button"
                    className="btn btn-danger bmd-btn-fab"
                    onClick={this.handleClick.bind(this)}>
                    <PlusIcon />
                </button>
            </div>
        );
    }
}

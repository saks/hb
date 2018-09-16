// @flow

import { Link } from 'react-router-dom'
import React from 'react'

import PlusIcon from '../components/PlusIcon'

export default () => (
    <div id="add-button" className="position-fixed">
        <Link to="/records/new">
            <button type="button" className="btn btn-danger bmd-btn-fab">
                <PlusIcon />
            </button>
        </Link>
    </div>
)

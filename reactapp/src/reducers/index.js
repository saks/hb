// @flow
import { combineReducers } from 'redux'

import auth from './auth'
import records from './Record'
import budgets from './budgets'
import spinner from './spinner'
import tags from './tags'

const reducers = {
    auth,
    records,
    budgets,
    spinner,
    tags,
}

export type Reducers = typeof reducers

export default combineReducers(reducers)

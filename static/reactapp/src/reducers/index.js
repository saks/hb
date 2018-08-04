// @flow
import { combineReducers } from 'redux';

import auth from './auth';
import records from './records';
import budgets from './budgets';
import spinner from './spinner';

const reducers = {
    auth,
    records,
    budgets,
    spinner,
};

export type Reducers = typeof reducers;

export default combineReducers(reducers);

import { combineReducers } from 'redux';

import auth from './auth';
import records from './records';
import budgets from './budgets';
import spinner from './spinner';

const rootReducer = combineReducers({
    auth,
    records,
    budgets,
    spinner,
});

export default rootReducer;

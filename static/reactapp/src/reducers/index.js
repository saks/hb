import { combineReducers } from 'redux';

import selectedWidget from './selectedWidget';
import auth from './auth';
import records from './records';
import budgets from './budgets';
import spinner from './spinner';

const rootReducer = combineReducers({
    selectedWidget,
    auth,
    records,
    budgets,
    spinner,
});

export default rootReducer;

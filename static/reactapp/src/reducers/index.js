import { combineReducers } from 'redux';

import selectedWidget from './selectedWidget';
import auth from './auth';
import records from './records';
import budgets from './budgets';

const rootReducer = combineReducers({
    selectedWidget,
    auth,
    records,
    budgets,
});

export default rootReducer;

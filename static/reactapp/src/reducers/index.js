import { combineReducers } from 'redux';

import selectedWidget from './selectedWidget';
import auth from './auth';
import records from './records';
import budgets from './budgets';
import spinner from './spinner';
import recordForm from './recordForm';

const rootReducer = combineReducers({
    selectedWidget,
    auth,
    records,
    budgets,
    spinner,
    recordForm,
});

export default rootReducer;

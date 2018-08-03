import { combineReducers } from 'redux';

import auth from './auth';
import records from './records';
import budgets from './budgets';
import spinner from './spinner';
import recordForm from './recordForm';

const rootReducer = combineReducers({
    auth,
    records,
    budgets,
    spinner,
    recordForm,
});

export default rootReducer;

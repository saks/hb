import { combineReducers } from 'redux';

import selectedWidget from './selectedWidget';
import auth from './auth';
import records from './records';

const rootReducer = combineReducers({
    selectedWidget,
    auth,
    records,
});

export default rootReducer;

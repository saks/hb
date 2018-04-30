import { combineReducers } from 'redux';

import selectedWidget from './selectedWidget';
import auth from './auth';

const rootReducer = combineReducers({
    selectedWidget,
    auth,
});

export default rootReducer;

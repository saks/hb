import { defineState } from 'redux-localstore';
import { SELECT_WIDGET } from '../constants/ActionTypes';

const initialState = defineState('RecordsList')('selectedWidget');
export default (state = initialState, action) => {
    switch (action.type) {
        case SELECT_WIDGET:
            return action.name;
        default:
            return state;
    }
};

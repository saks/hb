import { defineState } from 'redux-localstore';
import { SELECT_WIDGET } from '../constants/ActionTypes';
import { RECORDS_LIST } from '../constants/WidgetNames';

const initialState = defineState(RECORDS_LIST)('selectedWidget');
export default (state = initialState, action) => {
    switch (action.type) {
        case SELECT_WIDGET:
            return action.name;
        default:
            return state;
    }
};

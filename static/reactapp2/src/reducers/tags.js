import { defineState } from 'redux-localstore';
import { SET_TAGS } from '../constants/ActionTypes';

const initialState = defineState([])('selectedWidget');
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_TAGS:
            return action.tags;
        default:
            return state;
    }
};

import { defineState } from 'redux-localstore';

import {
    START_AUTH,
    FINIS_AUTH,
    ERROR_AUTH,
    SET_AUTH_TOKEN,
    SET_AUTH_PROFILE,
} from '../constants/ActionTypes';

const defaultState = {
    isFetching: false,
    errors: {},
    token: null,
    profile: {},
    parsedToken: {},
};

const initialState = defineState(defaultState)('auth');

export default (state = initialState, action) => {
    switch (action.type) {
        case START_AUTH:
            return { ...state, isFetching: true };
        case FINIS_AUTH:
            return { ...state, isFetching: false };
        case ERROR_AUTH:
            return { ...state, isFetching: false, errors: action.errors };
        case SET_AUTH_TOKEN:
            return { ...state, token: action.token, parsedToken: action.parsedToken };
        case SET_AUTH_PROFILE:
            return { ...state, profile: action.profile };
        default:
            return state;
    }
};

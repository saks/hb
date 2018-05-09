import { defineState } from 'redux-localstore';

import {
    OPEN_AUTH_DIALOG,
    CLOSE_AUTH_DIALOG,
    ERROR_AUTH,
    SET_AUTH_TOKEN,
    SET_AUTH_PROFILE,
    SIGN_OUT,
} from '../constants/ActionTypes';

const defaultState = {
    isDialogOpen: false,
    errors: {},
    token: null,
    profile: {},
    parsedToken: {},
};

const initialState = defineState(defaultState)('auth');

// don't cache errors
initialState.errors = {};
initialState.isDialogOpen = false;

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_AUTH_DIALOG:
            return { ...state, isDialogOpen: true };
        case CLOSE_AUTH_DIALOG:
            return { ...state, isDialogOpen: false };
        case ERROR_AUTH:
            return { ...state, errors: action.errors };
        case SET_AUTH_TOKEN:
            return { ...state, token: action.token, parsedToken: action.parsedToken, errors: {} };
        case SET_AUTH_PROFILE:
            return { ...state, profile: action.profile, errors: {} };
        case SIGN_OUT:
            return { ...state, profile: {}, token: null, parsedToken: {} };
        default:
            return state;
    }
};

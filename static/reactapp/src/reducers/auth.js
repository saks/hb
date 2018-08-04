// @flow

import { defineState } from 'redux-localstore';

import type { AuthState } from '../types/Data';
import type { AuthAction } from '../actions/Auth';

const defaultProfile = { tags: [] };
const defaultErrors = {};
const defaultToken = {};

const defaultState = {
    isDialogOpen: false,
    errors: defaultErrors,
    token: null,
    profile: defaultProfile,
    parsedToken: defaultToken,
};

const initialState: AuthState = defineState(defaultState)('auth');

// don't cache errors
initialState.errors = defaultErrors;
initialState.isDialogOpen = false;

export default (state: AuthState = initialState, action: AuthAction) => {
    switch (action.type) {
        case 'OPEN_AUTH_DIALOG':
            return { ...state, isDialogOpen: true };
        case 'CLOSE_AUTH_DIALOG':
            return { ...state, isDialogOpen: false };
        case 'ERROR_AUTH':
            return { ...state, errors: action.errors };
        case 'SET_AUTH_TOKEN':
            return {
                ...state,
                token: action.token,
                parsedToken: action.parsedToken,
                errors: defaultErrors,
            };
        case 'SET_AUTH_PROFILE':
            return { ...state, profile: action.profile, errors: defaultErrors };
        case 'SIGN_OUT':
            return { ...state, profile: defaultProfile, token: null, parsedToken: defaultToken };
        default:
            return state;
    }
};

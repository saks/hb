// @flow

import { defineState } from 'redux-localstore';

import type { State, Action, UserProfile, Errors, Token } from '../types/Auth';

const defaultProfile: UserProfile = { tags: [], email: '', username: '' };
const defaultErrors: Errors = {};
const defaultToken: Token = {};

const defaultState: State = {
    isDialogOpen: false,
    errors: defaultErrors,
    token: null,
    profile: defaultProfile,
    parsedToken: defaultToken,
};

const initialState: State = defineState(defaultState)('auth');

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case 'OPEN_AUTH_DIALOG':
            return { ...state, isDialogOpen: true };
        case 'CLOSE_AUTH_DIALOG':
            return { ...state, isDialogOpen: false };
        case 'SET_ERROR_AUTH':
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

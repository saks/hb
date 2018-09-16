// @flow

import { defineState } from 'redux-localstore'

import type { State, Action, Errors } from '../types/Auth'

const defaultErrors: Errors = {}

const defaultState: State = {
    isDialogOpen: false,
    errors: defaultErrors,
    token: null,
    parsedToken: null,
    profile: null,
}

const initialState: State = defineState(defaultState)('auth')

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case 'OPEN_AUTH_DIALOG':
            return { ...state, isDialogOpen: true }
        case 'CLOSE_AUTH_DIALOG':
            return { ...state, isDialogOpen: false }
        case 'SET_ERROR_AUTH':
            return { ...state, errors: action.errors }
        case 'SET_AUTH_TOKEN':
            return {
                ...state,
                token: action.token,
                parsedToken: action.parsedToken,
                errors: defaultErrors,
            }
        case 'SET_AUTH_PROFILE':
            return { ...state, profile: action.profile, errors: defaultErrors }
        case 'SIGN_OUT':
            return {
                ...state,
                profile: null,
                token: null,
                parsedToken: null,
                isDialogOpen: true,
            }
        default:
            return state
    }
}

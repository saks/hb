// @flow

import type {
    Token,
    UserProfile,
    OpenDialogAction,
    SignOutAction,
    CloseDialogAction,
    SetErrorsAction,
    SetTokenAction,
    SetUserProfileAction,
} from '../types/Auth'

const parseToken = (token: string): Token => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
}

export const openAuthDialog = (): OpenDialogAction => ({
    type: 'OPEN_AUTH_DIALOG',
})

export const signOut = (): SignOutAction => ({ type: 'SIGN_OUT' })

export const setAuthToken = (token: string): SetTokenAction => ({
    type: 'SET_AUTH_TOKEN',
    token,
    parsedToken: parseToken(token),
})

export const setAuthProfile = (profile: UserProfile): SetUserProfileAction => ({
    type: 'SET_AUTH_PROFILE',
    profile,
})

export const closeAuthDialog = (): CloseDialogAction => ({
    type: 'CLOSE_AUTH_DIALOG',
})

export const setAuthErrors = (authErrors: { [string]: Array<string> }): SetErrorsAction => {
    const errors = {}

    Object.keys(authErrors).forEach(fieldName => {
        errors[fieldName] = authErrors[fieldName].join(';')
    })

    return { type: 'SET_ERROR_AUTH', errors }
}

// @flow

// TYPES
import type { AuthToken, UserProfile } from '../types/Data';

type OpenAuthDialogAction = { type: 'OPEN_AUTH_DIALOG' };
type SignOutAction = { type: 'SIGN_OUT' };
type CloseAuthDialogAction = { type: 'CLOSE_AUTH_DIALOG' };
type AuthErrorsAction = { type: 'ERROR_AUTH', errors: { [string]: string } };
type SetAuthTokenAction = { type: 'SET_AUTH_TOKEN', token: string, parsedToken: AuthToken };
type SetAuthProfileAction = { type: 'SET_AUTH_PROFILE', profile: UserProfile };

export type AuthAction =
    | OpenAuthDialogAction
    | SignOutAction
    | CloseAuthDialogAction
    | AuthErrorsAction
    | SetAuthTokenAction
    | SetAuthProfileAction;
// END OF TYPES

const parsedToken = (token: string): AuthToken => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export const openAuthDialog = (): OpenAuthDialogAction => ({ type: 'OPEN_AUTH_DIALOG' });

export const signOut = (): SignOutAction => ({ type: 'SIGN_OUT' });

export const setAuthToken = (token: string): SetAuthTokenAction => ({
    type: 'SET_AUTH_TOKEN',
    token,
    parsedToken: parsedToken(token),
});

export const setAuthProfile = (profile: UserProfile): SetAuthProfileAction => ({
    type: 'SET_AUTH_PROFILE',
    profile,
});

export const closeAuthDialog = (): CloseAuthDialogAction => ({ type: 'CLOSE_AUTH_DIALOG' });

export const authErrors = (errors: any): AuthErrorsAction => {
    Object.keys(errors).forEach(fieldName => {
        errors[fieldName] = errors[fieldName].join(';');
    });

    return { type: 'ERROR_AUTH', errors };
};

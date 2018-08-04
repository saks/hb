// @flow

import {
    ERROR_AUTH,
    CLOSE_AUTH_DIALOG,
    SET_AUTH_PROFILE,
    SET_AUTH_TOKEN,
} from '../constants/ActionTypes';
import { loadDataForBudgetsPage, loadDataForRecordsPage, authFetch } from './index';

import { showSpinner, hideSpinner } from './Spinner';

import type { AuthErrors, AuthToken } from '../types/Data';
import type { Dispatch, GetState } from '../types/Dispatch';
import type { ThunkAction } from '../types/Action';

const authErrors = (errors: any): { type: typeof ERROR_AUTH, errors: AuthErrors } => {
    Object.keys(errors).forEach(fieldName => {
        errors[fieldName] = errors[fieldName].join(';');
    });

    return { type: ERROR_AUTH, errors };
};

const parsedToken = (token: string): AuthToken => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

const setAuthToken = (token: string) => {
    return { type: SET_AUTH_TOKEN, token, parsedToken: parsedToken(token) };
};
const setAuthProfile = profile => ({ type: SET_AUTH_PROFILE, profile });
const closeAuthDialog = () => ({ type: CLOSE_AUTH_DIALOG });

export const AuthenticateAction = (formData: {|
    username: string,
    password: string,
|}): ThunkAction => {
    return async (dispatch: Dispatch, getState: GetState) => {
        dispatch(showSpinner());
        const tokenResponse = await fetch('/auth/jwt/create/', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'User-Agent': 'Home Budget PWA',
                'Content-Type': 'application/json',
            },
        });
        dispatch(hideSpinner());

        if (!tokenResponse.ok) {
            dispatch(authErrors(await tokenResponse.json()));
            return;
        }

        const tokenData = await tokenResponse.json();
        dispatch(setAuthToken(tokenData.token));
        const userId: number = getState().auth.parsedToken.user_id;

        const request = new Request(`/api/user/${userId}/`);
        const profileResponse = await dispatch(authFetch(request));
        if (null === profileResponse) {
            return;
        }

        const profile = await profileResponse.json();
        dispatch(setAuthProfile(profile));
        dispatch(closeAuthDialog());

        // refresh all data
        dispatch(loadDataForRecordsPage());
        dispatch(loadDataForBudgetsPage());
    };
};

// @flow

import typeof {
    SET_AUTH_TOKEN,
    SET_AUTH_PROFILE,
    SET_TAGS,
    OPEN_AUTH_DIALOG,
    CLOSE_AUTH_DIALOG,
    ERROR_AUTH,
    SIGN_OUT,
    START_LOADING_RECORDS_PAGE,
    FINIS_LOADING_RECORDS_PAGE,
    SET_CURRENT_PAGE_FOR_RECORDS_PAGE,
    SET_LIST_FOR_RECORDS_PAGE,
    START_LOADING_BUDGETS_PAGE,
    FINIS_LOADING_BUDGETS_PAGE,
    SET_LIST_FOR_BUDGETS_PAGE,
    SHOW_SPINNER,
    HIDE_SPINNER,
} from '../constants/ActionTypes';

import type { Dispatch, GetState } from './Dispatch';

import { AuthToken } from './Data';

export type SetAuthTokenAction = { type: SET_AUTH_TOKEN, token: string, parsedToken: AuthToken };
export type SignOutAction = { type: SIGN_OUT };
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

export type Action = SetAuthTokenAction | SignOutAction | ThunkAction;

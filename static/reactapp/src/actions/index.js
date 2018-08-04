// @flow

import RecordModel from '../models/Record';
import {
    OPEN_AUTH_DIALOG,
    SIGN_OUT,
    START_LOADING_RECORDS_PAGE,
    FINIS_LOADING_RECORDS_PAGE,
    SET_CURRENT_PAGE_FOR_RECORDS_PAGE,
    SET_LIST_FOR_RECORDS_PAGE,
    START_LOADING_BUDGETS_PAGE,
    FINIS_LOADING_BUDGETS_PAGE,
    SET_LIST_FOR_BUDGETS_PAGE,
} from '../constants/ActionTypes';
import { showSpinner, hideSpinner } from './Spinner';

import type { Dispatch, GetState } from '../types/Dispatch';
import type { ThunkAction } from '../types/Action';
import AuthenticateAction from './LoginDialog';

export const openAuthDialog = () => ({ type: OPEN_AUTH_DIALOG });

const signOut = () => ({ type: SIGN_OUT });

export const authFetch = (request: Request) => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const token = getState().auth.token;

        request.headers.set('Authorization', `JWT ${token}`);
        request.headers.set('User-Agent', 'Home Budget PWA');
        request.headers.set('Content-Type', 'application/json');

        dispatch(showSpinner());
        const result = await fetch(request);
        dispatch(hideSpinner());

        if (!result.ok && result.status === 401) {
            dispatch(signOut());
            dispatch(openAuthDialog());

            return null;
            // TODO: refresh auth token
        }

        return result;
    };
};

export const authenticate = AuthenticateAction;

// RecordsList
const startLoadingRecordsList = () => ({ type: START_LOADING_RECORDS_PAGE });
const finisLoadingRecordsList = () => ({ type: FINIS_LOADING_RECORDS_PAGE });

const setCurrentPageForRecordsPage = pageNum => ({
    type: SET_CURRENT_PAGE_FOR_RECORDS_PAGE,
    pageNum,
});

const setListForRecordsPage = list => ({ type: SET_LIST_FOR_RECORDS_PAGE, list });

export const visitNextRecordsPage = () => {
    return async (dispatch: Dispatch, getState: GetState) => {
        dispatch(startLoadingRecordsList());

        const nextPageNum = getState().records.currentPage + 1;
        const request = new Request(`/api/records/record-detail/?page=${nextPageNum}`);
        const result = await dispatch(authFetch(request));

        if (null === result) {
            return;
        }

        if (404 === result.status) {
            dispatch(finisLoadingRecordsList());
            return;
        }

        const json = await result.json();

        dispatch(setCurrentPageForRecordsPage(nextPageNum));
        dispatch(setListForRecordsPage(json.results));
        dispatch(finisLoadingRecordsList());
    };
};

export const visitPrevRecordsPage = () => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const prevPageNum = getState().records.currentPage - 1;

        if (0 === prevPageNum) {
            return;
        }

        dispatch(startLoadingRecordsList());

        const request = new Request(`/api/records/record-detail/?page=${prevPageNum}`);
        const result = await dispatch(authFetch(request));
        const json = await result.json();

        dispatch(setCurrentPageForRecordsPage(prevPageNum));
        dispatch(setListForRecordsPage(json.results));
        dispatch(finisLoadingRecordsList());
    };
};

export const loadDataForRecordsPage = () => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const pageNum = getState().records.currentPage;

        dispatch(startLoadingRecordsList());

        const request = new Request(`/api/records/record-detail/?page=${pageNum}`);
        const result = await dispatch(authFetch(request));
        const json = await result.json();

        dispatch(setListForRecordsPage(json.results));
        dispatch(finisLoadingRecordsList());
    };
};

// record form

export const submitRecordForm = (record: RecordModel): ThunkAction => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const method = record.isPersisted ? 'PUT' : 'POST';
        const body = JSON.stringify(record.asJson());
        const url = `/api/records/record-detail${record.isPersisted ? '/' + record.id : ''}/`;

        const request = new Request(url, { method, body });
        const result = await dispatch(authFetch(request));

        if (result.ok) {
            // const record = await result.json();
            // refresh all data
            dispatch(loadDataForRecordsPage());
        } else {
            debugger;
        }

        return result.ok;
    };
};

// budgets
const startLoadingBudgetsList = () => ({ type: START_LOADING_BUDGETS_PAGE });
const finisLoadingBudgetsList = () => ({ type: FINIS_LOADING_BUDGETS_PAGE });
const setListForBudgetsPage = list => ({ type: SET_LIST_FOR_BUDGETS_PAGE, list });

export const loadDataForBudgetsPage = () => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoadingBudgetsList());

        const request = new Request('/api/budgets/budget-detail/');
        const result = await dispatch(authFetch(request));
        const json = await result.json();

        dispatch(setListForBudgetsPage(json.results));
        dispatch(finisLoadingBudgetsList());
    };
};

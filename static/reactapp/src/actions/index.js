// @flow

import RecordModel from '../models/Record';
import {
    START_LOADING_BUDGETS_PAGE,
    FINIS_LOADING_BUDGETS_PAGE,
    SET_LIST_FOR_BUDGETS_PAGE,
} from '../constants/ActionTypes';
import { showSpinner, hideSpinner } from './Spinner';
import { signOut, openAuthDialog } from './Auth';
import AuthenticateAction from './LoginDialog';
import { LoadDataForRecordsPage, VisitNextRecordsPage, VisitPrevRecordsPage } from './RecordsList';

import type { Dispatch, GetState } from '../types/Dispatch';
import type { ThunkAction } from '../types/Action';
import type { GlobalState } from '../types/Data';

export const authFetch = (request: Request) => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const globalState: GlobalState = getState();
        const token = globalState.auth.token;

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
export const loadDataForRecordsPage = LoadDataForRecordsPage;
export const visitPrevRecordsPage = VisitPrevRecordsPage;
export const visitNextRecordsPage = VisitNextRecordsPage;

// RecordsList

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

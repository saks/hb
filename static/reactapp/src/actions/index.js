// @flow

import RecordModel from '../models/Record';
import { showSpinner, hideSpinner } from './Spinner';
import { signOut, openAuthDialog } from './Auth';
import { loadDataForRecordsPage } from './RecordsList';
import authenticate from './LoginDialog';

import type { Dispatch, GetState } from '../types/Dispatch';
import type { ThunkAction } from '../types/Action';

export { openAuthDialog } from './Auth';

export const authFetch = (request: Request) => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const token = getState().auth.token;

        if (token) {
            request.headers.set('Authorization', `JWT ${token}`);
        }
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

export { visitPrevRecordsPage, visitNextRecordsPage } from './RecordsList';
export { loadDataForRecordsPage, authenticate };

// record form
export const submitRecordForm = (record: RecordModel): ThunkAction => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const method = record.isPersisted ? 'PUT' : 'POST';
        const body = JSON.stringify(record.asJson);
        const url = `/api/records/record-detail${
            record.isPersisted ? '/' + String(record.id) : ''
        }/`;

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

export { loadData as loadDataForBudgetsPage } from './Budget';

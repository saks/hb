// @flow

import { authFetch } from './index';

import type { Dispatch, GetState } from '../types/Dispatch';
import type { RecordAttrs, GlobalState } from '../types/Data';

type StartLoadingRecordsListAction = { type: 'START_LOADING_RECORDS_PAGE' };
type FinisLoadingRecordsListAction = { type: 'FINIS_LOADING_RECORDS_PAGE' };
type SetCurrentPageForRecordsPageAction = {
    type: 'SET_CURRENT_PAGE_FOR_RECORDS_PAGE',
    pageNum: number,
};
type SetListForRecordsPageAction = {
    type: 'SET_LIST_FOR_RECORDS_PAGE',
    list: Array<RecordAttrs>,
};

export type RecordsAction =
    | StartLoadingRecordsListAction
    | FinisLoadingRecordsListAction
    | SetCurrentPageForRecordsPageAction
    | SetListForRecordsPageAction;

const startLoadingRecordsList = (): StartLoadingRecordsListAction => ({
    type: 'START_LOADING_RECORDS_PAGE',
});
const finisLoadingRecordsList = (): FinisLoadingRecordsListAction => ({
    type: 'FINIS_LOADING_RECORDS_PAGE',
});

const setCurrentPageForRecordsPage = (pageNum: number): SetCurrentPageForRecordsPageAction => ({
    type: 'SET_CURRENT_PAGE_FOR_RECORDS_PAGE',
    pageNum,
});

const setListForRecordsPage = (list: Array<RecordAttrs>): SetListForRecordsPageAction => ({
    type: 'SET_LIST_FOR_RECORDS_PAGE',
    list,
});

export const VisitNextRecordsPage = () => {
    return async (dispatch: Dispatch, getState: GetState) => {
        dispatch(startLoadingRecordsList());

        const globalState: GlobalState = getState();
        const nextPageNum = globalState.records.currentPage + 1;
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

export const VisitPrevRecordsPage = () => {
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

export const LoadDataForRecordsPage = () => {
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

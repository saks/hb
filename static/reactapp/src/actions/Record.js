// @flow

import { authFetch } from './index';

import type { Dispatch, GetState } from '../types/Dispatch';
import type {
    Attrs,
    StartLoadingAction,
    FinisLoadingAction,
    SetListAction,
    SetCurrentPageAction,
} from '../types/Record';

const startLoading = (): StartLoadingAction => ({ type: 'START_LOADING_RECORDS_PAGE' });
const finisLoading = (): FinisLoadingAction => ({ type: 'FINIS_LOADING_RECORDS_PAGE' });

const setCurrentPage = (pageNum: number): SetCurrentPageAction => ({
    type: 'SET_CURRENT_PAGE_FOR_RECORDS_PAGE',
    pageNum,
});

const setList = (list: Array<Attrs>): SetListAction => ({
    type: 'SET_LIST_FOR_RECORDS_PAGE',
    list,
});

export const visitNextPage = () => {
    return async (dispatch: Dispatch, getState: GetState) => {
        dispatch(startLoading());

        const nextPageNum = getState().records.currentPage + 1;
        const request = new Request(`/api/records/record-detail/?page=${nextPageNum}`);
        const result = await dispatch(authFetch(request));

        if (null === result) {
            return;
        }

        if (404 === result.status) {
            dispatch(finisLoading());
            return;
        }

        const json = await result.json();

        dispatch(setCurrentPage(nextPageNum));
        dispatch(setList(json.results));
        dispatch(finisLoading());
    };
};

export const visitPrevPage = () => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const prevPageNum = getState().records.currentPage - 1;

        if (0 === prevPageNum) {
            return;
        }

        dispatch(startLoading());

        const request = new Request(`/api/records/record-detail/?page=${prevPageNum}`);
        const result = await dispatch(authFetch(request));
        const json = await result.json();

        dispatch(setCurrentPage(prevPageNum));
        dispatch(setList(json.results));
        dispatch(finisLoading());
    };
};

export const loadData = () => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const pageNum = getState().records.currentPage;

        dispatch(startLoading());

        const request = new Request(`/api/records/record-detail/?page=${pageNum}`);
        const result = await dispatch(authFetch(request));
        const json = await result.json();

        dispatch(setList(json.results));
        dispatch(finisLoading());
    };
};

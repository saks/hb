// @flow

import { defineState } from 'redux-localstore';

import type { RecordsState } from '../types/Data';
import type { RecordsAction } from '../actions/RecordsList';

const defaultState = {
    currentPage: 1,
    list: [],
    isFetching: false,
};

const initialState: RecordsState = defineState(defaultState)('records');

export default (state: RecordsState = initialState, action: RecordsAction) => {
    switch (action.type) {
        case 'START_LOADING_RECORDS_PAGE':
            return { ...state, isFetching: true };
        case 'FINIS_LOADING_RECORDS_PAGE':
            return { ...state, isFetching: false };
        case 'SET_LIST_FOR_RECORDS_PAGE':
            return { ...state, list: action.list };
        case 'SET_CURRENT_PAGE_FOR_RECORDS_PAGE':
            return { ...state, currentPage: action.pageNum };
        default:
            return state;
    }
};

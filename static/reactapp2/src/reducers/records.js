import { defineState } from 'redux-localstore';

import {
    START_LOADING_RECORDS_PAGE,
    FINIS_LOADING_RECORDS_PAGE,
    SET_CURRENT_PAGE_FOR_RECORDS_PAGE,
    SET_LIST_FOR_RECORDS_PAGE,
} from '../constants/ActionTypes';

const defaultState = {
    currentPage: 1,
    list: [],
    isFetching: false,
};

const initialState = defineState(defaultState)('records');

// don't read cached records
initialState.list = [];
initialState.currentPage = 1;

export default (state = initialState, action) => {
    switch (action.type) {
        case START_LOADING_RECORDS_PAGE:
            return { ...state, isFetching: true };
        case FINIS_LOADING_RECORDS_PAGE:
            return { ...state, isFetching: false };
        case SET_LIST_FOR_RECORDS_PAGE:
            return { ...state, list: action.list };
        case SET_CURRENT_PAGE_FOR_RECORDS_PAGE:
            return { ...state, currentPage: action.pageNum };
        default:
            return state;
    }
};

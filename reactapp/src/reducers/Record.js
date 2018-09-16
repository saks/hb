// @flow

import { defineState } from 'redux-localstore'

import type { State, Action } from '../types/Record'

const defaultState: State = {
    currentPage: 1,
    list: [],
    isFetching: false,
}

const initialState: State = defineState(defaultState)('records')

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case 'START_LOADING_RECORDS_PAGE':
            return { ...state, isFetching: true }
        case 'FINIS_LOADING_RECORDS_PAGE':
            return { ...state, isFetching: false }
        case 'SET_LIST_FOR_RECORDS_PAGE':
            return { ...state, list: action.list }
        case 'SET_CURRENT_PAGE_FOR_RECORDS_PAGE':
            return { ...state, currentPage: action.pageNum }
        default:
            return state
    }
}

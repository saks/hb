// @flow

import type { State, Action } from '../types/Budget'

const defaultState: State = {
    list: [],
    isFetching: false,
}

export default (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case 'START_LOADING_BUDGETS_PAGE':
            return { ...state, isFetching: true }
        case 'FINIS_LOADING_BUDGETS_PAGE':
            return { ...state, isFetching: false }
        case 'SET_LIST_FOR_BUDGETS_PAGE':
            return { ...state, list: action.list.reverse() }
        default:
            return state
    }
}

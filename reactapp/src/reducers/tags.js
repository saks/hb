// @flow

import type { State, Action } from '../types/Tags'

const defaultState: State = {
    list: [],
    isFetching: false,
}

export default (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case 'START_LOADING_TAGS':
            return { ...state, isFetching: true }
        case 'FINIS_LOADING_TAGS':
            return { ...state, isFetching: false }
        case 'SET_TAGS':
            return { ...state, list: action.list }
        default:
            return state
    }
}

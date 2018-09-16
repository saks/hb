// @flow

import type { Action, State } from '../types/Spinner'

const defaultState: State = {
    isVisible: false,
}

export default (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case 'SHOW_SPINNER':
            return { ...state, isVisible: true }
        case 'HIDE_SPINNER':
            return { ...state, isVisible: false }
        default:
            return state
    }
}

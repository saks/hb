// @flow

import type { SpinnerState as State } from '../types/Data';
import type { Action } from '../actions/Spinner';

const defaultState: State = {
    isVisible: false,
};

export default (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case 'SHOW_SPINNER':
            return { ...state, isVisible: true };
        case 'HIDE_SPINNER':
            return { ...state, isVisible: false };
        default:
            return state;
    }
};

import { SHOW_SPINNER, HIDE_SPINNER } from '../constants/ActionTypes';

const defaultState = {
    isVisible: false,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case SHOW_SPINNER:
            return { ...state, isVisible: true };
        case HIDE_SPINNER:
            return { ...state, isVisible: false };
        default:
            return state;
    }
};

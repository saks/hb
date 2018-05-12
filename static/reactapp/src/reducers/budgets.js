import {
    START_LOADING_BUDGETS_PAGE,
    FINIS_LOADING_BUDGETS_PAGE,
    SET_LIST_FOR_BUDGETS_PAGE,
} from '../constants/ActionTypes';

const defaultState = {
    list: [],
    isFetching: false,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case START_LOADING_BUDGETS_PAGE:
            return { ...state, isFetching: true };
        case FINIS_LOADING_BUDGETS_PAGE:
            return { ...state, isFetching: false };
        case SET_LIST_FOR_BUDGETS_PAGE:
            return { ...state, list: action.list };
        default:
            return state;
    }
};

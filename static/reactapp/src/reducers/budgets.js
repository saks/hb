// @flow

import type { BudgetsState } from '../types/Data';
import type { BudgetsAction } from '../actions/Budgets';

const defaultState: BudgetsState = {
    list: [],
    isFetching: false,
};

export default (state: BudgetsState = defaultState, action: BudgetsAction) => {
    switch (action.type) {
        case 'START_LOADING_BUDGETS_PAGE':
            return { ...state, isFetching: true };
        case 'FINIS_LOADING_BUDGETS_PAGE':
            return { ...state, isFetching: false };
        case 'SET_LIST_FOR_BUDGETS_PAGE':
            return { ...state, list: action.list.reverse() };
        default:
            return state;
    }
};

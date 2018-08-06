// @flow

import { authFetch } from './index';

import type { Dispatch } from '../types/Dispatch';
import type { Attrs } from '../types/Budget';
import type { ThunkAction } from '../types/Action';

type StartLoadingAction = { type: 'START_LOADING_BUDGETS_PAGE' };
type FinisLoadingAction = { type: 'FINIS_LOADING_BUDGETS_PAGE' };
type SetListAction = { type: 'SET_LIST_FOR_BUDGETS_PAGE', list: Array<Attrs> };

export type Action = StartLoadingAction | FinisLoadingAction | SetListAction;

const startLoading = (): StartLoadingAction => ({
    type: 'START_LOADING_BUDGETS_PAGE',
});
const finisLoading = (): FinisLoadingAction => ({
    type: 'FINIS_LOADING_BUDGETS_PAGE',
});
const setList = (list: Array<Attrs>): SetListAction => ({
    type: 'SET_LIST_FOR_BUDGETS_PAGE',
    list,
});

export const loadDataForBudgetsPage = (): ThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());

        const request = new Request('/api/budgets/budget-detail/');
        const result = await dispatch(authFetch(request));
        const json = await result.json();

        dispatch(setList(json.results));
        dispatch(finisLoading());
    };
};

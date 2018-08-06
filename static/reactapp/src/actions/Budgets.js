// @flow

import { authFetch } from './index';

import type { Dispatch } from '../types/Dispatch';
import type { BudgetAttrs } from '../types/Data';
import type { ThunkAction } from '../types/Action';

type StartLoadingBudgetsListAction = { type: 'START_LOADING_BUDGETS_PAGE' };
type FinisLoadingBudgetsListAction = { type: 'FINIS_LOADING_BUDGETS_PAGE' };
type SetListForBudgetsPageAction = { type: 'SET_LIST_FOR_BUDGETS_PAGE', list: Array<BudgetAttrs> };

export type BudgetsAction =
    | StartLoadingBudgetsListAction
    | FinisLoadingBudgetsListAction
    | SetListForBudgetsPageAction;

const startLoadingBudgetsList = (): StartLoadingBudgetsListAction => ({
    type: 'START_LOADING_BUDGETS_PAGE',
});
const finisLoadingBudgetsList = (): FinisLoadingBudgetsListAction => ({
    type: 'FINIS_LOADING_BUDGETS_PAGE',
});
const setListForBudgetsPage = (list: Array<BudgetAttrs>): SetListForBudgetsPageAction => ({
    type: 'SET_LIST_FOR_BUDGETS_PAGE',
    list,
});

export const loadDataForBudgetsPage = (): ThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoadingBudgetsList());

        const request = new Request('/api/budgets/budget-detail/');
        const result = await dispatch(authFetch(request));
        const json = await result.json();

        dispatch(setListForBudgetsPage(json.results));
        dispatch(finisLoadingBudgetsList());
    };
};

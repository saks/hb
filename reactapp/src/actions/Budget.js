// @flow

import { authFetch } from './index'

import type { Dispatch } from '../types/Dispatch'
import type { Attrs, StartLoadingAction, FinisLoadingAction, SetListAction } from '../types/Budget'
import type { ThunkAction } from '../types/Action'

const setList = (list: Array<Attrs>): SetListAction => ({
    type: 'SET_LIST_FOR_BUDGETS_PAGE',
    list,
})
const startLoading = (): StartLoadingAction => ({
    type: 'START_LOADING_BUDGETS_PAGE',
})
const finisLoading = (): FinisLoadingAction => ({
    type: 'FINIS_LOADING_BUDGETS_PAGE',
})

export const loadData = (): ThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading())

        const request = new Request('/api/budgets/budget-detail/')
        const result = await dispatch(authFetch(request))
        const json = await result.json()

        dispatch(setList(json.results))
        dispatch(finisLoading())
    }
}

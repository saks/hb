// @flow

import { authFetch } from './index'

import type { Dispatch } from '../types/Dispatch'
import type { StartLoadingAction, FinisLoadingAction, SetListAction } from '../types/Tags'
import type { ThunkAction } from '../types/Action'

const setList = (list: Array<string>): SetListAction => ({
    type: 'SET_TAGS',
    list,
})
const startLoading = (): StartLoadingAction => ({
    type: 'START_LOADING_TAGS',
})
const finisLoading = (): FinisLoadingAction => ({
    type: 'FINIS_LOADING_TAGS',
})

export const loadData = (): ThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading())

        // TODO: handle errors
        const request = new Request('/api/tags/')
        const response = await dispatch(authFetch(request))
        const result = await response.json()

        dispatch(setList(result.tags))
        dispatch(finisLoading())
    }
}

export const syncData = (list: Array<string>): ThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading())

        // TODO: handle validation errors
        const body = JSON.stringify({ tags: list })
        const request = new Request('/api/tags/', { method: 'PUT', body: body })
        const response = await dispatch(authFetch(request))
        const result = await response.json()

        dispatch(setList(result.tags))
        dispatch(finisLoading())
    }
}

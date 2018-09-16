// @flow

import { authFetch } from './index'

import type { Dispatch, GetState } from '../types/Dispatch'
import type { ThunkAction } from '../types/Action'
import type {
    Attrs,
    StartLoadingAction,
    FinisLoadingAction,
    SetListAction,
    SetCurrentPageAction,
} from '../types/Record'

const startLoading = (): StartLoadingAction => ({
    type: 'START_LOADING_RECORDS_PAGE',
})
const finisLoading = (): FinisLoadingAction => ({
    type: 'FINIS_LOADING_RECORDS_PAGE',
})

const setCurrentPage = (pageNum: number): SetCurrentPageAction => ({
    type: 'SET_CURRENT_PAGE_FOR_RECORDS_PAGE',
    pageNum,
})

const setList = (list: Array<Attrs>): SetListAction => ({
    type: 'SET_LIST_FOR_RECORDS_PAGE',
    list,
})

const loadPageNum = async (
    dispatch: Dispatch,
    pageNum: number,
    updateCurrentPage: boolean = true
): Promise<typeof undefined> => {
    dispatch(startLoading())

    const request = new Request(`/api/records/record-detail/?page=${pageNum}`)
    const result = await dispatch(authFetch(request))

    // TODO: show errors to user if any happens
    const json = await result.json()

    if (updateCurrentPage) {
        dispatch(setCurrentPage(pageNum))
    }

    dispatch(setList(json.results))
    dispatch(finisLoading())
}

export const visitNextPage = (): ThunkAction => {
    return (dispatch: Dispatch, getState: GetState) => {
        return loadPageNum(dispatch, getState().records.currentPage + 1)
    }
}

export const visitPrevPage = () => {
    return (dispatch: Dispatch, getState: GetState) => {
        const prevPageNum = getState().records.currentPage - 1

        if (0 === prevPageNum) {
            return
        }

        return loadPageNum(dispatch, prevPageNum)
    }
}

export const loadData = () => {
    return async (dispatch: Dispatch, getState: GetState) => {
        return loadPageNum(dispatch, getState().records.currentPage, false)
    }
}

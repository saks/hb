// @flow

import RecordModel from '../models/Record'

export type Attrs = {
    id: number,
    user: string,
    tags: Array<string>,
    amount: { amount: number, currency: { code: string, name: string } },
    transaction_type: string,
    created_at: number,
}

export type State = {
    +currentPage: number,
    +isFetching: boolean,
    +list: Array<Attrs>,
}

export type StartLoadingAction = { type: 'START_LOADING_RECORDS_PAGE' }
export type FinisLoadingAction = { type: 'FINIS_LOADING_RECORDS_PAGE' }
export type SetCurrentPageAction = {
    type: 'SET_CURRENT_PAGE_FOR_RECORDS_PAGE',
    pageNum: number,
}
export type SetListAction = {
    type: 'SET_LIST_FOR_RECORDS_PAGE',
    list: Array<Attrs>,
}

export type Action = StartLoadingAction | FinisLoadingAction | SetCurrentPageAction | SetListAction

export type Record = typeof RecordModel

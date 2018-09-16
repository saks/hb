// @flow

export type StartLoadingAction = { type: 'START_LOADING_BUDGETS_PAGE' }
export type FinisLoadingAction = { type: 'FINIS_LOADING_BUDGETS_PAGE' }
export type SetListAction = {
    type: 'SET_LIST_FOR_BUDGETS_PAGE',
    list: Array<Attrs>,
}

export type Action = StartLoadingAction | FinisLoadingAction | SetListAction

export type Attrs = {
    user: string,
    amount: string,
    left: number,
    name: string,
    left_average_per_day: number,
    average_per_day: number,
    spent: number,
}

export type State = {
    +isFetching: boolean,
    +list: Array<Attrs>,
}

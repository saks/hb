// @flow

export type StartLoadingAction = { type: 'START_LOADING_TAGS' }
export type FinisLoadingAction = { type: 'FINIS_LOADING_TAGS' }
export type SetListAction = { type: 'SET_TAGS', list: Array<string> }

export type Action = StartLoadingAction | FinisLoadingAction | SetListAction

export type State = {
    +isFetching: boolean,
    +list: Array<string>,
}

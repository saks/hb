// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'
import type { Action, ThunkAction, PromiseAction } from './Action'
import type { State } from './State'

export type Store = ReduxStore<State, Action>

export type GetState = () => State

// export type Dispatch = ReduxDispatch<Action> & Thunk<Action>;

export type Thunk<A> = ((Dispatch, GetState) => Promise<void> | void) => A

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any

// @flow

import type { Dispatch, GetState } from './Dispatch'

import type { Action as AuthAction } from './Auth'
import type { Action as RecordAction } from './Record'
import type { Action as BudgetAction } from './Budget'
import type { Action as SpinnerAction } from './Spinner'
import type { Action as TagsAction } from './Tags'

export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any
export type PromiseAction = Promise<Action>

export type Action = AuthAction | RecordAction | BudgetAction | SpinnerAction | TagsAction

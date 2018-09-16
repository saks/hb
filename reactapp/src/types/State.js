// @flow
import type { State as BudgetsState } from './Budget'
import type { State as RecordsState } from './Record'
import type { State as AuthState } from './Auth'
import type { State as SpinnerState } from './Spinner'
import type { State as TagsState } from './Tags'

export type State = {
    +auth: AuthState,
    +records: RecordsState,
    +spinner: SpinnerState,
    +budgets: BudgetsState,
    +tags: TagsState,
}

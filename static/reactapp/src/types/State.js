// @flow
import type { State as BudgetsState } from './Budget';
import type { State as RecordsState } from './Record';
import type { State as AuthState } from './Auth';
import type { State as SpinnerState } from './Spinner';

type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;

export type State = {
    +auth: AuthState,
    +records: RecordsState,
    +spinner: SpinnerState,
    +budgets: BudgetsState,
};

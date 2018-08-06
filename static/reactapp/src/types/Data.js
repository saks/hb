// @flow

import type { State as BudgetsState } from './Budget';
import type { State as RecordsState } from './Record';

export type AuthToken = { email: string, exp: number, user_id: number, username: string };

export type AuthErrors = {
    username?: string,
    password?: string,
    non_field_errors?: string,
};

export type UserProfile = {
    username: string,
    email: string,
    tags: Array<string>,
};

export type AuthState = {
    +isDialogOpen: boolean,
    +token: null | string,
    +profile: UserProfile,
    +parsedToken: AuthToken,
};

export type SpinnerState = {
    +isVisible: boolean,
};

export type GlobalState = {
    +auth: AuthState,
    +records: RecordsState,
    +spinner: SpinnerState,
    +budgets: BudgetsState,
};

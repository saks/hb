// @flow

export type AuthToken = { email: string, exp: number, user_id: number, username: string };

export type RecordAttrs = {
    id: number,
    user: string,
    tags: Array<string>,
    amount: { amount: number, currency: { code: string, name: string } },
    transaction_type: string,
    created_at: number,
};

export type BudgetAttrs = {
    user: string,
    amount: string,
    left: number,
    name: string,
    left_average_per_day: number,
    average_per_day: number,
    spent: number,
};

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

export type RecordsState = {
    +currentPage: number,
    +isFetching: boolean,
    +list: Array<RecordAttrs>,
};

export type SpinnerState = {
    +isVisible: boolean,
};

export type BudgetsState = {
    +isFetching: boolean,
    +list: Array<BudgetAttrs>,
};

export type GlobalState = {
    +auth: AuthState,
    +records: RecordsState,
    +spinner: SpinnerState,
    +budgets: BudgetsState,
};

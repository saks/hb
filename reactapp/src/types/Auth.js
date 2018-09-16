// @flow

export type Token = {
    email: string,
    exp: number,
    user_id: number,
    username: string,
}

export type Errors = {
    username?: string,
    password?: string,
    non_field_errors?: string,
}

export type UserProfile = {
    username: string,
    email: string,
    tags: Array<string>,
}

export type State = {
    +isDialogOpen: boolean,
    +token: ?string,
    +profile: ?UserProfile,
    +parsedToken: ?Token,
    +errors: Errors,
}

export type OpenDialogAction = { type: 'OPEN_AUTH_DIALOG' }
export type SignOutAction = { type: 'SIGN_OUT' }
export type CloseDialogAction = { type: 'CLOSE_AUTH_DIALOG' }
export type SetErrorsAction = { type: 'SET_ERROR_AUTH', errors: Errors }
export type SetTokenAction = {
    type: 'SET_AUTH_TOKEN',
    token: string,
    parsedToken: Token,
}
export type SetUserProfileAction = {
    type: 'SET_AUTH_PROFILE',
    profile: UserProfile,
}

export type Action =
    | OpenDialogAction
    | SignOutAction
    | CloseDialogAction
    | SetErrorsAction
    | SetTokenAction
    | SetUserProfileAction

// @flow

export type State = {
    +isVisible: boolean,
}

export type ShowAction = { type: 'SHOW_SPINNER' }
export type HideAction = { type: 'HIDE_SPINNER' }

export type Action = ShowAction | HideAction

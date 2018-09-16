// @flow

import type { ShowAction, HideAction } from '../types/Spinner'

export const show = (): ShowAction => ({ type: 'SHOW_SPINNER' })
export const hide = (): HideAction => ({ type: 'HIDE_SPINNER' })

// @flow

import type { Dispatch, GetState } from './Dispatch';

import type { AuthToken } from './Data';

export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

export type Action = any; // FIXME

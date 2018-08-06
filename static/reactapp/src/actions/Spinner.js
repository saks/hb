// @flow

type ShowSpinnerAction = { type: 'SHOW_SPINNER' };
type HideSpinnerAction = { type: 'HIDE_SPINNER' };

export type Action = ShowSpinnerAction | HideSpinnerAction;

export const showSpinner = (): ShowSpinnerAction => ({ type: 'SHOW_SPINNER' });
export const hideSpinner = (): HideSpinnerAction => ({ type: 'HIDE_SPINNER' });

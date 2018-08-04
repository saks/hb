// @flow
import type { Reducers } from '../reducers';
import type { GlobalState } from './Data';

type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;

export type State = GlobalState;

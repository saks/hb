import {
    EDIT_RECORD,
    RECORD_FORM_TOGGLE_TAG,
    RECORD_FORM_SET_AMOUNT,
    RECORD_FORM_SET_TYPE,
    RECORD_FORM_CALCULATE_AMOUNT,
} from '../constants/ActionTypes';
import RecordModel from '../models/Record';

const calc = text => {
    try {
        const evalResult = Number.parseFloat(eval(text));
        if (Number.isFinite(evalResult)) {
            return evalResult.toFixed(2);
        }
    } catch (_err) {}
};

const defaultState = {
    record: RecordModel.default(),
};

const clone = state => {
    const result = { record: new RecordModel(state.record) };
    return result;
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case EDIT_RECORD:
            return { record: action.record };
        case RECORD_FORM_SET_TYPE:
            return (() => {
                const newState = clone(state);
                newState.record.transaction_type = action.value;
                return newState;
            })();
        case RECORD_FORM_SET_AMOUNT:
            return (() => {
                const newState = clone(state);
                newState.record.amount.amount = action.value;
                return newState;
            })();
        case RECORD_FORM_CALCULATE_AMOUNT:
            return (() => {
                const newState = clone(state);
                newState.record.amount.amount = calc(state.record.amount.amount) || '';
                return newState;
            })();
        case RECORD_FORM_TOGGLE_TAG:
            return (() => {
                const newState = clone(state);
                newState.record.toggleTag(action.tag);
                return newState;
            })();
        default:
            return state;
    }
};

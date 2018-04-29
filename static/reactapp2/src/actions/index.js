import { SELECT_WIDGET } from '../constants/ActionTypes';

export const selectWidget = widgetName => {
    return { type: SELECT_WIDGET, widgetName };
};

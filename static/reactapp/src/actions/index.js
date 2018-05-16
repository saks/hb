import {
    SELECT_WIDGET,
    SET_AUTH_TOKEN,
    SET_AUTH_PROFILE,
    SET_TAGS,
    OPEN_AUTH_DIALOG,
    CLOSE_AUTH_DIALOG,
    ERROR_AUTH,
    SIGN_OUT,
    START_LOADING_RECORDS_PAGE,
    FINIS_LOADING_RECORDS_PAGE,
    SET_CURRENT_PAGE_FOR_RECORDS_PAGE,
    SET_LIST_FOR_RECORDS_PAGE,
    START_LOADING_BUDGETS_PAGE,
    FINIS_LOADING_BUDGETS_PAGE,
    SET_LIST_FOR_BUDGETS_PAGE,
    SHOW_SPINNER,
    HIDE_SPINNER,
    EDIT_RECORD,
    RECORD_FORM_TOGGLE_TAG,
    RECORD_FORM_SET_AMOUNT,
    RECORD_FORM_SET_TYPE,
    RECORD_FORM_CALCULATE_AMOUNT,
} from '../constants/ActionTypes';
import { RECORD_FORM } from '../constants/WidgetNames';
import store from '../store';

export const selectWidget = name => ({ type: SELECT_WIDGET, name });
export const setTags = tags => ({ type: SET_TAGS, tags });

const parsedToken = token => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

const setAuthToken = token => {
    return { type: SET_AUTH_TOKEN, token, parsedToken: parsedToken(token) };
};
const setAuthProfile = profile => ({ type: SET_AUTH_PROFILE, profile });
export const openAuthDialog = () => ({ type: OPEN_AUTH_DIALOG });
const closeAuthDialog = () => ({ type: CLOSE_AUTH_DIALOG });
const authErrors = errors => {
    Object.keys(errors).forEach(fieldName => {
        errors[fieldName] = errors[fieldName].join(';');
    });

    return { type: ERROR_AUTH, errors };
};

const signOut = () => ({ type: SIGN_OUT });

export const authFetch = (options = {}) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const url = options.url;
        delete options.url;

        if (!options.headers) {
            options.headers = {};
        }

        options.headers.Authorization = `JWT ${token}`;
        options.headers['User-Agent'] = 'Home Budget PWA';
        options.headers['Content-Type'] = 'application/json';

        dispatch(showSpinner());
        const result = await fetch(url, options);
        dispatch(hideSpinner());

        if (!result.ok && result.status === 401) {
            dispatch(signOut());
            dispatch(openAuthDialog());

            return null;
            // TODO: refresh auth token
        }

        return result;
    };
};

export const authenticate = formData => {
    return async (dispatch, getState) => {
        dispatch(showSpinner());
        const tokenResponse = await fetch('/auth/jwt/create/', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'User-Agent': 'Home Budget PWA',
                'Content-Type': 'application/json',
            },
        });
        dispatch(hideSpinner());

        if (!tokenResponse.ok) {
            dispatch(authErrors(await tokenResponse.json()));
            return;
        }

        const tokenData = await tokenResponse.json();
        dispatch(setAuthToken(tokenData.token));
        const userId = getState().auth.parsedToken.user_id;

        const profileResponse = await dispatch(authFetch({ url: `/api/user/${userId}/` }));
        if (null === profileResponse) {
            return;
        }

        const profile = await profileResponse.json();
        dispatch(setAuthProfile(profile));
        dispatch(closeAuthDialog());

        // refresh all data
        dispatch(loadDataForRecordsPage());
        dispatch(loadDataForBudgetsPage());
    };
};

// RecordsList
const startLoadingRecordsList = () => ({ type: START_LOADING_RECORDS_PAGE });
const finisLoadingRecordsList = () => ({ type: FINIS_LOADING_RECORDS_PAGE });

const setCurrentPageForRecordsPage = pageNum => ({
    type: SET_CURRENT_PAGE_FOR_RECORDS_PAGE,
    pageNum,
});

const setListForRecordsPage = list => ({ type: SET_LIST_FOR_RECORDS_PAGE, list });

export const visitNextRecordsPage = () => {
    return async (dispatch, getState) => {
        dispatch(startLoadingRecordsList());

        const nextPageNum = getState().records.currentPage + 1;
        const url = `/api/records/record-detail/?page=${nextPageNum}`;
        const result = await dispatch(authFetch({ url }));

        if (null === result) {
            return;
        }

        if (404 === result.status) {
            dispatch(finisLoadingRecordsList());
            return;
        }

        const json = await result.json();

        dispatch(setCurrentPageForRecordsPage(nextPageNum));
        dispatch(setListForRecordsPage(json.results));
        dispatch(finisLoadingRecordsList());
    };
};

export const visitPrevRecordsPage = () => {
    return async (dispatch, getState) => {
        const prevPageNum = getState().records.currentPage - 1;

        if (0 === prevPageNum) {
            return;
        }

        dispatch(startLoadingRecordsList());

        const url = `/api/records/record-detail/?page=${prevPageNum}`;
        const result = await dispatch(authFetch({ url }));
        const json = await result.json();

        dispatch(setCurrentPageForRecordsPage(prevPageNum));
        dispatch(setListForRecordsPage(json.results));
        dispatch(finisLoadingRecordsList());
    };
};

export const loadDataForRecordsPage = () => {
    return async (dispatch, getState) => {
        const pageNum = getState().records.currentPage;

        dispatch(startLoadingRecordsList());

        const url = `/api/records/record-detail/?page=${pageNum}`;
        const result = await dispatch(authFetch({ url }));
        const json = await result.json();

        dispatch(setListForRecordsPage(json.results));
        dispatch(finisLoadingRecordsList());
    };
};

// record form
export const submitRecordForm = returnTo => {
    return async (dispatch, getState) => {
        const record = getState().recordForm.record;
        const isPersisted = Boolean(record.id);

        const method = isPersisted ? 'PUT' : 'POST';
        const body = JSON.stringify(record.asJson());
        const url = `/api/records/record-detail/${record.id}`;

        const result = await dispatch(authFetch({ url, method, body }));

        if (result.ok) {
            // const record = await result.json();
            // refresh all data
            dispatch(loadDataForRecordsPage());
            dispatch(selectWidget(returnTo));
        } else {
            debugger;
        }

        return result.ok;
    };
};

export const editRecord = record => {
    store.dispatch({ type: EDIT_RECORD, record });
    return selectWidget(RECORD_FORM);
};
export const startEditingRecord = record => ({ type: EDIT_RECORD, record });
export const toggleRecordFormTag = tag => ({ type: RECORD_FORM_TOGGLE_TAG, tag });
export const setRecordFormAmount = value => ({ type: RECORD_FORM_SET_AMOUNT, value });
export const setRecordFormTransactionType = value => ({ type: RECORD_FORM_SET_TYPE, value });
export const calculateRecordFormAmount = () => ({ type: RECORD_FORM_CALCULATE_AMOUNT });

// budgets
const startLoadingBudgetsList = () => ({ type: START_LOADING_BUDGETS_PAGE });
const finisLoadingBudgetsList = () => ({ type: FINIS_LOADING_BUDGETS_PAGE });
const setListForBudgetsPage = list => ({ type: SET_LIST_FOR_BUDGETS_PAGE, list });

export const loadDataForBudgetsPage = () => {
    return async dispatch => {
        dispatch(startLoadingBudgetsList());

        const result = await dispatch(authFetch({ url: '/api/budgets/budget-detail/' }));
        const json = await result.json();

        dispatch(setListForBudgetsPage(json.results));
        dispatch(finisLoadingBudgetsList());
    };
};

// spinner
const showSpinner = () => ({ type: SHOW_SPINNER });
const hideSpinner = () => ({ type: HIDE_SPINNER });

import {
    SELECT_WIDGET,
    SET_AUTH_TOKEN,
    SET_AUTH_PROFILE,
    SET_TAGS,
    START_AUTH,
    FINIS_AUTH,
    ERROR_AUTH,
} from '../constants/ActionTypes';

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
const startAuth = () => ({ type: START_AUTH });
const finisAuth = () => ({ type: FINIS_AUTH });
const authErrors = errors => {
    Object.keys(errors).forEach(fieldName => {
        errors[fieldName] = errors[fieldName].join(';');
    });

    return { type: ERROR_AUTH, errors };
};

export const authFetch = (options = {}) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const url = options.url;

        if (!options.headers) {
            options.headers = {};
        }

        options.headers.Authorization = `JWT ${token}`;
        options.headers['User-Agent'] = 'Home Budget PWA';
        options.headers['Content-Type'] = 'application/json';

        const result = await fetch(url, options);

        if (!result.ok && result.status === 401) {
            debugger;
            // await this.refresh();
            // if (this.instance.isSignedIn) {
            //     return this.fetch(url, options);
            // } else {
            //     this.instance.openSignInDialog();
            // }
        }

        return result;
    };
};

export const authenticate = formData => {
    return async (dispatch, getState) => {
        dispatch(startAuth());
        const tokenResponse = await fetch('/auth/jwt/create/', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'User-Agent': 'Home Budget PWA',
                'Content-Type': 'application/json',
            },
        });

        if (!tokenResponse.ok) {
            dispatch(authErrors(await tokenResponse.json()));
            return;
        }

        const tokenData = await tokenResponse.json();
        dispatch(setAuthToken(tokenData.token));
        const userId = getState().auth.parsedToken.user_id;

        const profileResponse = await dispatch(authFetch({ url: `/api/user/${userId}/` }));
        const profile = await profileResponse.json();
        dispatch(setAuthProfile(profile));
        dispatch(finisAuth());
    };
};

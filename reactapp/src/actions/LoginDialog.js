// @flow

import { loadDataForBudgetsPage, loadDataForRecordsPage, authFetch } from './index'
import { show as showSpinner, show as hideSpinner } from './Spinner'
import { setAuthErrors, setAuthToken, setAuthProfile, closeAuthDialog } from './Auth'
import { loadData as loadTags } from './Tags'

import type { Dispatch, GetState } from '../types/Dispatch'
import type { ThunkAction } from '../types/Action'
import type { UserProfile } from '../types/Auth'

export default (formData: {| username: string, password: string |}): ThunkAction => {
    return async (dispatch: Dispatch, getState: GetState) => {
        dispatch(showSpinner())
        const tokenResponse = await fetch('/auth/jwt/create/', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'User-Agent': 'Home Budget PWA',
                'Content-Type': 'application/json',
            },
        })
        dispatch(hideSpinner())

        if (!tokenResponse.ok) {
            dispatch(setAuthErrors(await tokenResponse.json()))
            return
        }

        const tokenData = await tokenResponse.json()
        dispatch(setAuthToken(tokenData.token))
        const parsedToken = getState().auth.parsedToken

        if (!parsedToken) {
            // TODO: dispatch error: "failed to parse auth token"
            return
        }

        const userId = parsedToken.user_id
        const profileRequest = new Request(`/api/user/${userId}/`)
        const profileResponse = await dispatch(authFetch(profileRequest))

        if (null === profileResponse) {
            // TODO: dispatch error: "failed to get user profile"
            return
        }

        const profile: UserProfile = await profileResponse.json()
        dispatch(setAuthProfile(profile))
        dispatch(closeAuthDialog())

        // refresh all data
        dispatch(loadTags())
        dispatch(loadDataForRecordsPage())
        dispatch(loadDataForBudgetsPage())
    }
}

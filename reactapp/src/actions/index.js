// @flow

import RecordModel from '../models/Record'
import { show as showSpinner, hide as hideSpinner } from './Spinner'
import { signOut } from './Auth'
import { loadData as loadDataForRecordsPage } from './Record'
import { loadData as loadDataForTagsPage } from './Tags'
import authenticate from './LoginDialog'

import type { Dispatch, GetState } from '../types/Dispatch'
import type { ThunkAction } from '../types/Action'

export { openAuthDialog } from './Auth'

export const authFetch = (request: Request) => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const token = getState().auth.token

        if (!token) {
            dispatch(signOut())
            return
        }

        request.headers.set('Authorization', `JWT ${token}`)
        request.headers.set('User-Agent', 'Home Budget PWA')
        request.headers.set('Content-Type', 'application/json')

        dispatch(showSpinner())
        const result = await fetch(request)
        dispatch(hideSpinner())

        if (!result.ok && result.status === 401) {
            dispatch(signOut())

            return null
            // TODO: refresh auth token
        }

        return result
    }
}

export {
    visitPrevPage as visitPrevRecordsPage,
    visitNextPage as visitNextRecordsPage,
} from './Record'
export { loadDataForRecordsPage, loadDataForTagsPage, authenticate }

// record form
export const submitRecordForm = (record: RecordModel): ThunkAction => {
    return async (dispatch: Dispatch, getState: GetState) => {
        const method = record.isPersisted ? 'PUT' : 'POST'
        const body = JSON.stringify(record.asJson)
        const url = `/api/records/record-detail${
            record.isPersisted ? '/' + String(record.id) : ''
        }/`

        const request = new Request(url, { method, body })
        const result = await dispatch(authFetch(request))

        if (result.ok) {
            // const record = await result.json();
            // refresh all data
            dispatch(loadDataForRecordsPage())
            dispatch(loadDataForTagsPage())
        } else {
            debugger
        }

        return result.ok
    }
}

export { loadData as loadDataForBudgetsPage } from './Budget'
export { syncData as syncTags } from './Tags'

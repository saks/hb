import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './Record';
import fetchMock from 'fetch-mock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Record actions', () => {
    const expectPageLoad = options => {
        const config = Object.assign(
            {
                currentPage: 1,
                token: 'foo-auth-token',
                responseBody: { results: [{ this_is: 'record' }] },
            },
            options
        );

        fetchMock.getOnce(
            request => {
                expect(request.headers.get('content-type')).toEqual('application/json');
                expect(request.headers.get('authorization')).toEqual(`JWT ${config.token}`);
                expect(request.url).toEqual(
                    `/api/records/record-detail/?page=${config.currentPage}`
                );
                return true;
            },
            { body: JSON.stringify(config.responseBody), status: 200 }
        );
    };
    const initStore = options => {
        const config = Object.assign({ currentPage: 1, token: 'foo-auth-token' }, options);
        return mockStore({
            records: { currentPage: config.currentPage, list: [] },
            auth: { token: config.token },
        });
    };

    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });

    it('should load data with spinner', async () => {
        expectPageLoad();

        const expectedActions = [
            { type: 'START_LOADING_RECORDS_PAGE' },
            { type: 'SHOW_SPINNER' },
            { type: 'HIDE_SPINNER' },
            { type: 'SET_LIST_FOR_RECORDS_PAGE', list: [{ this_is: 'record' }] },
            { type: 'FINIS_LOADING_RECORDS_PAGE' },
        ];

        const store = initStore();

        await store.dispatch(actions.loadData());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should not visit previous page from page #1', async () => {
        const store = initStore({ currentPage: 1 });

        await store.dispatch(actions.visitPrevPage());
        expect(store.getActions()).toEqual([]);
    });

    it('should visit previous page', async () => {
        expectPageLoad({ currentPage: 1 });

        const store = initStore({ currentPage: 2 });
        await store.dispatch(actions.visitPrevPage());

        const expectedActions = [
            { type: 'START_LOADING_RECORDS_PAGE' },
            { type: 'SHOW_SPINNER' },
            { type: 'HIDE_SPINNER' },
            { pageNum: 1, type: 'SET_CURRENT_PAGE_FOR_RECORDS_PAGE' },
            { type: 'SET_LIST_FOR_RECORDS_PAGE', list: [{ this_is: 'record' }] },
            { type: 'FINIS_LOADING_RECORDS_PAGE' },
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should visit next page', async () => {
        expectPageLoad({ currentPage: 3 });
        const store = initStore({ currentPage: 2 });

        await store.dispatch(actions.visitNextPage());

        const expectedActions = [
            { type: 'START_LOADING_RECORDS_PAGE' },
            { type: 'SHOW_SPINNER' },
            { type: 'HIDE_SPINNER' },
            { pageNum: 3, type: 'SET_CURRENT_PAGE_FOR_RECORDS_PAGE' },
            { type: 'SET_LIST_FOR_RECORDS_PAGE', list: [{ this_is: 'record' }] },
            { type: 'FINIS_LOADING_RECORDS_PAGE' },
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    // TODO: add test for network errors and error responses
});

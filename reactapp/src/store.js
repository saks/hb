// @flow

import { createStore, applyMiddleware } from 'redux'
import storeSynchronize from 'redux-localstore'

import thunk from 'redux-thunk'
// import { createLogger } from 'redux-logger';
import reducer from './reducers'

const middlewares = [thunk]
if (process.env.NODE_ENV !== 'production') {
    // middlewares.push(createLogger());
}
const store = createStore(reducer, applyMiddleware(...middlewares))

storeSynchronize(store)

export default store

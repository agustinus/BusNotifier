import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import ReduxRoot from './ReduxRoot';
import HttpResponseErrorHandler from './HttpErrorResponseHandler';

let Store = null;
if (!Store) {
    Store = createStore(ReduxRoot.Reducer, applyMiddleware(ReduxThunk, HttpResponseErrorHandler));
}

export default Store;
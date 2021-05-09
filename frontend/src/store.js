import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

var initialState = {};

var middleware = [thunk];

var store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;
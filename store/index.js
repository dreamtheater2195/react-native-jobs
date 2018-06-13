import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import logger from 'redux-logger';
const store = createStore(
    reducers,
    {},
    compose(
        applyMiddleware(thunk, logger),
        autoRehydrate()
    )
);

persistStore(store, {
    storage: AsyncStorage,
    whiteList: 'likes'
});

export default store;
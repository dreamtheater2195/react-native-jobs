import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import logger from 'redux-logger';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: 'likes'
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    pReducer,
    {},
    compose(
        applyMiddleware(thunk, logger)
    )
);

export const persistor = persistStore(store);
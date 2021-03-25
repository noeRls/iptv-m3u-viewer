import { combineReducers, createStore, applyMiddleware } from '@reduxjs/toolkit';
import { appSlice } from './reducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    app: appSlice.reducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export type RootState = ReturnType<typeof rootReducer>;

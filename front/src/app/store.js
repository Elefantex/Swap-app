import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { apiSlice, apiReducer } from './apiSlice';

const rootReducer = combineReducers({
  api: apiReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
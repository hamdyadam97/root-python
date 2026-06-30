import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import examReducer from './examSlice';
import packagesReducer from './packagesSlice';
import supportReducer from './supportSlice';
import chatReducer from './chatSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    packages: packagesReducer,
    support: supportReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

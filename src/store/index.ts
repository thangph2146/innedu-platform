import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import rolesReducer from './slices/rolesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    roles: rolesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
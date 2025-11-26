import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredients from './slices/ingredients';
import user from './slices/user';
import feed from './slices/feed';
import orders from './slices/orders';
import burgerConstructor from './slices/constructor';
import { orderDetails } from './slices/order-details';

const rootReducer = combineReducers({
  ingredients,
  user,
  feed,
  orders,
  burgerConstructor,
  orderDetails
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { placeOrder } from './constructor';

type OrdersState = {
  orders: TOrder[];
  lastOrder: TOrder | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const initialState: OrdersState = {
  orders: [],
  lastOrder: null,
  status: 'idle',
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetLastOrder: (state) => {
      state.lastOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // оформление заказа
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.status = 'succeeded';
        state.lastOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      })
      // история заказов
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.status = 'succeeded';
          state.orders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.error.message ?? 'Не удалось загрузить историю заказов';
      });
  }
});

export const { resetLastOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

export const selectUserOrders = (state: RootState) => state.orders.orders;
export const selectLastOrder = (state: RootState) => state.orders.lastOrder;
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectOrdersError = (state: RootState) => state.orders.error;

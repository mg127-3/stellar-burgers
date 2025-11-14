import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

type TOrderDetailsState = {
    order: TOrder | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
};

const initialState: TOrderDetailsState = {
    order: null,
    status: 'idle',
    error: null
};

export const fetchOrderByNumber = createAsyncThunk(
    'orderDetails/fetchByNumber',
    async (number: number, { rejectWithValue }) => {
        try {
            const response = await getOrderByNumberApi(number);
            return response.orders[0] ?? null;
        } catch (error) {
            return rejectWithValue('Не удалось получить заказ');
        }
    }
);

const orderDetailsSlice = createSlice({
    name: 'orderDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderByNumber.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.order = null;
            })
            .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.order = action.payload;
            })
            .addCase(fetchOrderByNumber.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) ?? 'Ошибка загрузки заказа';
            });
    }
});

export const selectOrderDetails = (state: RootState) => state.orderDetails;

export const orderDetails = orderDetailsSlice.reducer;

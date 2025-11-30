import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';
import type { RootState } from '../store';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.status = 'succeeded';
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Ошибка загрузки';
      });
  }
});

export default feedSlice.reducer;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedStatus = (state: RootState) => state.feed.status;
export const selectFeedError = (state: RootState) => state.feed.error;
export const selectFeedTotals = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});

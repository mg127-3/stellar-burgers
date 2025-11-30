import { expect } from '@jest/globals';

import reducer, { fetchFeed } from '../slices/feed';
import { TOrdersData } from '@utils-types';

describe('Testing feedSlice', () => {
  const mockFeedData: TOrdersData & { success: boolean } = {
    success: true,
    orders: [
      {
        _id: '1',
        name: 'Order 1',
        status: 'created',
        createdAt: '2023-11-30T12:00:00Z',
        updatedAt: '2023-11-30T12:00:00Z',
        number: 1,
        ingredients: ['ingredient1', 'ingredient2']
      },
      {
        _id: '2',
        name: 'Order 2',
        status: 'done',
        createdAt: '2023-11-30T13:00:00Z',
        updatedAt: '2023-11-30T13:00:00Z',
        number: 2,
        ingredients: ['ingredient3', 'ingredient4']
      }
    ],
    total: 300,
    totalToday: 100
  };

  test('should handle fetchFeed.pending', () => {
    const action = fetchFeed.pending('', undefined);
    const state = reducer(undefined, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('should handle fetchFeed.fulfilled', () => {
    const action = fetchFeed.fulfilled(mockFeedData, '', undefined);
    const state = reducer(undefined, action);
    expect(state.status).toBe('succeeded');
    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.total).toBe(mockFeedData.total);
    expect(state.totalToday).toBe(mockFeedData.totalToday);
  });

  test('should handle fetchFeed.rejected', () => {
    const action = fetchFeed.rejected(
      new Error('Ошибка загрузки'),
      '',
      undefined
    );
    const state = reducer(undefined, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка загрузки');
  });
});

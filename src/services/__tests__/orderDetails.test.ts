import { expect } from '@jest/globals';
import { orderDetailsSlice, fetchOrderByNumber } from '../slices/order-details';
import { TOrder } from '@utils-types';

describe('Testing orderDetailsSlice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    status: 'created',
    name: 'Order 1',
    createdAt: '2023-11-30T12:00:00Z',
    updatedAt: '2023-11-30T12:00:00Z',
    number: 1,
    ingredients: ['ingredient1', 'ingredient2']
  };

  const reducer = orderDetailsSlice.reducer;

  test('should handle fetchOrderByNumber.pending', () => {
    const action = fetchOrderByNumber.pending('1', 1, undefined);
    const state = reducer(undefined, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
    expect(state.order).toBeNull();
  });

  test('should handle fetchOrderByNumber.fulfilled', () => {
    const action = fetchOrderByNumber.fulfilled(mockOrder, '1', 1);
    const state = reducer(undefined, action);
    expect(state.status).toBe('succeeded');
    expect(state.order).toEqual(mockOrder);
  });

  test('should handle fetchOrderByNumber.rejected', () => {
    const action = fetchOrderByNumber.rejected(
      new Error('Ошибка загрузки заказа'),
      '1',
      1
    );
    const state = reducer(undefined, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка загрузки заказа');
  });
});

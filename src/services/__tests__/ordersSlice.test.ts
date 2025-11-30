import { expect } from '@jest/globals';
import { ordersSlice, fetchUserOrders, resetLastOrder } from '../slices/orders';
import { placeOrder } from '../slices/constructor';
import { TOrder } from '@utils-types';

describe('Testing ordersSlice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    status: 'created',
    name: 'Order 1',
    createdAt: '2023-11-30T12:00:00Z',
    updatedAt: '2023-11-30T12:00:00Z',
    number: 1,
    ingredients: ['ingredient1', 'ingredient2']
  };

  const reducer = ordersSlice.reducer;

  test('should handle fetchUserOrders.pending', () => {
    const action = fetchUserOrders.pending('', undefined);
    const state = reducer(undefined, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('should handle fetchUserOrders.fulfilled', () => {
    const action = fetchUserOrders.fulfilled([mockOrder], '', undefined);
    const state = reducer(undefined, action);
    expect(state.status).toBe('succeeded');
    expect(state.orders).toEqual([mockOrder]);
  });

  test('should handle fetchUserOrders.rejected', () => {
    const action = fetchUserOrders.rejected(
      new Error('Не удалось загрузить историю заказов'),
      '',
      undefined
    );
    const state = reducer(undefined, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Не удалось загрузить историю заказов');
  });

  test('should handle placeOrder.pending', () => {
    const action = fetchUserOrders.pending('', undefined);
    const state = reducer(undefined, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('should handle placeOrder.fulfilled', () => {
    const action = placeOrder.fulfilled(mockOrder, '', undefined);
    const state = reducer(undefined, action);
    expect(state.status).toBe('succeeded');
    expect(state.lastOrder).toEqual(mockOrder);
  });

  test('should handle placeOrder.rejected', () => {
    const action = fetchUserOrders.rejected(
      new Error('Не удалось оформить заказ'),
      '',
      undefined
    );
    const state = reducer(undefined, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Не удалось оформить заказ');
  });
});

import { expect } from '@jest/globals';

import { store } from '../store';

import { initialState as burgerConstructor } from '../slices/constructor';
import { initialState as user } from '../slices/user';
import { initialState as feed } from '../slices/feed';
import { initialState as ingredients } from '../slices/ingredients';
import { initialState as orders } from '../slices/orders';
import { initialState as orderDetails } from '../slices/order-details';

describe('Testing Root Reducer', () => {
    test('testing reducer initialization', () => {
        const state = store.getState();

        expect(state).toEqual({
            ingredients,
            user,
            feed,
            orders,
            burgerConstructor,
            orderDetails
        });
    });
});

import { expect } from '@jest/globals';
import reducer, { fetchIngredients } from '../slices/ingredients';
import { TIngredient } from '@utils-types';

describe('Testing ingredientsSlice', () => {
    const mockIngredients: TIngredient[] = [
        {
            _id: '1',
            name: 'Ingredient 1',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            price: 1255,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        },
        {
            _id: '2',
            name: 'Ingredient 2',
            type: 'main',
            proteins: 420,
            fat: 142,
            carbohydrates: 242,
            calories: 4242,
            price: 424,
            image: 'https://code.s3.yandex.net/react/code/meat-01.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        }
    ];

    test('should handle fetchIngredients.pending', () => {
        const action = fetchIngredients.pending('', undefined);
        const state = reducer(undefined, action);
        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
    });

    test('should handle fetchIngredients.fulfilled', () => {
        const action = fetchIngredients.fulfilled(mockIngredients, '', undefined);
        const state = reducer(undefined, action);
        expect(state.status).toBe('succeeded');
        expect(state.items).toEqual(mockIngredients);
    });

    test('should handle fetchIngredients.rejected', () => {
        const action = fetchIngredients.rejected(
            new Error('Ошибка загрузки ингредиентов'),
            '',
            undefined
        );
        const state = reducer(undefined, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });
});

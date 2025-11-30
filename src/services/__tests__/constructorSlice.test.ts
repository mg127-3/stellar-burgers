import { expect } from '@jest/globals';
import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  reorderIngredients,
  clearConstructor
} from '../slices/constructor';
import { TIngredient } from '@utils-types';

describe('Testing constructorSlice', () => {
  const mockBun: TIngredient = {
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
  };

  const mockMain: TIngredient = {
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
  };

  const mockSauce: TIngredient = {
    _id: '3',
    name: 'Ingredient 3',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  };

  test('adding a bun to the constructor', () => {
    const state = constructorSlice.reducer(undefined, addIngredient(mockBun));
    expect(state.bun).toMatchObject({
      ...mockBun,
      id: expect.any(String)
    });
  });

  test('removing an ingredient from the constructor', () => {
    const add = constructorSlice.reducer(undefined, addIngredient(mockMain));
    expect(add.ingredients.length).toBe(1);

    const toRemove = add.ingredients[0];
    const remove = constructorSlice.reducer(add, removeIngredient(toRemove.id));
    expect(remove.ingredients.length).toBe(0);
  });

  test('changing the the order of the ingredients', () => {
    let state = constructorSlice.reducer(undefined, addIngredient(mockMain));
    state = constructorSlice.reducer(state, addIngredient(mockSauce));

    const changeOrder = constructorSlice.reducer(
      state,
      reorderIngredients({ fromIndex: 1, toIndex: 0 })
    );

    expect(changeOrder.ingredients[0].name).toBe('Ingredient 3');
    expect(changeOrder.ingredients[1].name).toBe('Ingredient 2');
  });

  test('removing ingredients from the constructor', () => {
    let state = constructorSlice.reducer(undefined, addIngredient(mockBun));
    state = constructorSlice.reducer(state, addIngredient(mockMain));

    const reset = constructorSlice.reducer(state, clearConstructor());
    expect(reset.bun).toBe(null);
    expect(reset.ingredients.length).toBe(0);
  });
});

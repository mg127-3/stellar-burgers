import {
  createSlice,
  PayloadAction,
  nanoid,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';
import type { RootState } from '../store';

export type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const placeOrder = createAsyncThunk(
  'burgerConstructor/placeOrder',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { bun, ingredients } = state.burgerConstructor;
    if (!bun) throw new Error('Булка не выбрана');
    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    const data = await orderBurgerApi(ids);
    return data.order;
  }
);

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ing = action.payload;
      if (ing.type === 'bun') state.bun = ing;
      else state.ingredients.push({ ...ing, id: nanoid() });
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },
    reorderIngredients: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length
      )
        return;
      const item = state.ingredients[fromIndex];
      state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, item);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  }
});

export const {
  addIngredient,
  removeIngredient,
  reorderIngredients,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

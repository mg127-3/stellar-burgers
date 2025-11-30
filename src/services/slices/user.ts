import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type UserState = {
  user: TUser | null;
  isAuth: boolean;
  isAuthChecked: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const initialState: UserState = {
  user: null,
  isAuth: false,
  isAuthChecked: false,
  status: 'idle',
  error: null
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (payload: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(payload);
      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Ошибка регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (payload: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(payload);
      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Ошибка авторизации');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Не авторизован');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (payload: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(payload);
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Ошибка обновления профиля');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Ошибка выхода');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // register:

      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.status = 'succeeded';
          state.user = action.payload;
          state.isAuth = true;
          state.isAuthChecked = true;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuth = false;
        state.user = null;
        state.error = (action.payload as string) ?? 'Ошибка регистрации';
        state.isAuthChecked = true;
      })

      // login:

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuth = false;
        state.user = null;
        state.error = (action.payload as string) ?? 'Ошибка авторизации';
        state.isAuthChecked = true;
      })

      //checkAuth:

      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuth = false;
        state.isAuthChecked = true;
        state.error = (action.payload as string) ?? 'Не авторизован';
      })

      // update:

      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.status = 'succeeded';
          state.user = action.payload;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Ошибка обновления профиля';
      })

      // logout:

      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.isAuth = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Ошибка выхода';
      });
  }
});

export default userSlice.reducer;

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuth = (state: { user: UserState }) => state.user.isAuth;
export const selectIsAuthChecked = (state: { user: UserState }) =>
  state.user.isAuthChecked;
export const selectUserStatus = (state: { user: UserState }) =>
  state.user.status;
export const selectUserError = (state: { user: UserState }) => state.user.error;

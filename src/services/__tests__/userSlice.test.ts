import { expect } from '@jest/globals';
import {
    userSlice,
    registerUser,
    loginUser,
    checkAuth,
    updateProfile,
    logoutUser
} from '../slices/user';
import { TUser } from '@utils-types';
import { TRegisterData, TLoginData } from '../../utils/burger-api';

describe('Testing userSlice', () => {
    const mockUser: TUser = {
        email: 'john.doe@example.com',
        name: 'John Doe'
    };

    const mockLoginUser: TLoginData = {
        email: 'john.doe@example.com',
        password: 'password123'
    };

    const mockRegisterData: TRegisterData = {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'password123'
    };

    const mockUpdateProfileData: Partial<TRegisterData> = {
        email: 'john.doe@example.com',
        name: 'John Updated',
        password: 'newpassword123'
    };

    const reducer = userSlice.reducer;

    // registerUser

    test('should handle registerUser.pending', () => {
        const action = registerUser.pending(
            'registerUser/pending',
            mockRegisterData
        );
        const state = reducer(undefined, action);
        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
    });

    test('should handle registerUser.fulfilled', () => {
        const action = registerUser.fulfilled(
            mockRegisterData,
            '',
            mockRegisterData
        );
        const state = reducer(undefined, action);
        expect(state.status).toBe('succeeded');
        expect(state.user).toEqual(mockRegisterData);
        expect(state.isAuth).toBe(true);
        expect(state.isAuthChecked).toBe(true);
    });

    test('should handle registerUser.rejected', () => {
        const action = registerUser.rejected(
            new Error('Ошибка регистрации'),
            '',
            mockRegisterData
        );
        const state = reducer(undefined, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Ошибка регистрации');
        expect(state.isAuth).toBe(false);
        expect(state.user).toBeNull();
    });

    // loginUser

    test('should handle loginUser.pending', () => {
        const action = loginUser.pending('', mockLoginUser);
        const state = reducer(undefined, action);
        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
    });

    test('should handle loginUser.fulfilled', () => {
        const action = loginUser.fulfilled(mockUser, '', mockLoginUser);
        const state = reducer(undefined, action);
        expect(state.status).toBe('succeeded');
        expect(state.user).toEqual(mockUser);
        expect(state.isAuth).toBe(true);
    });

    test('should handle loginUser.rejected', () => {
        const action = loginUser.rejected(
            new Error('Ошибка авторизации'),
            '',
            mockLoginUser
        );
        const state = reducer(undefined, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Ошибка авторизации');
        expect(state.isAuth).toBe(false);
    });

    // checkAuth

    test('should handle checkAuth.pending', () => {
        const action = checkAuth.pending('', undefined);
        const state = reducer(undefined, action);
        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
    });

    test('should handle checkAuth.fulfilled', () => {
        const action = checkAuth.fulfilled(mockUser, '', undefined);
        const state = reducer(undefined, action);
        expect(state.status).toBe('succeeded');
        expect(state.user).toEqual(mockUser);
        expect(state.isAuth).toBe(true);
    });

    test('should handle checkAuth.rejected', () => {
        const action = checkAuth.rejected(
            new Error('Не авторизован'),
            '',
            undefined
        );
        const state = reducer(undefined, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Не авторизован');
        expect(state.isAuth).toBe(false);
    });

    // updateProfile

    test('should handle updateProfile.pending', () => {
        const action = updateProfile.pending('', mockUpdateProfileData);
        const state = reducer(undefined, action);
        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
    });

    test('should handle updateProfile.fulfilled', () => {
        const action = updateProfile.fulfilled(mockUser, '', mockUpdateProfileData);
        const state = reducer(undefined, action);
        expect(state.status).toBe('succeeded');
        expect(state.user).toEqual(mockUser);
    });

    test('should handle updateProfile.rejected', () => {
        const action = updateProfile.rejected(
            new Error('Ошибка обновления профиля'),
            '',
            mockUpdateProfileData
        );
        const state = reducer(undefined, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Ошибка обновления профиля');
    });

    // logoutUser

    test('should handle logoutUser.pending', () => {
        const action = logoutUser.pending('', undefined);
        const state = reducer(undefined, action);
        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
    });

    test('should handle logoutUser.fulfilled', () => {
        const action = logoutUser.fulfilled(undefined, '', undefined);
        const state = reducer(undefined, action);
        expect(state.status).toBe('succeeded');
        expect(state.user).toBeNull();
        expect(state.isAuth).toBe(false);
    });

    test('should handle logoutUser.rejected', () => {
        const action = logoutUser.rejected(
            new Error('Ошибка выхода'),
            '',
            undefined
        );
        const state = reducer(undefined, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Ошибка выхода');
    });
});

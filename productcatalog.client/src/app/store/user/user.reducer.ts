import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import {
    loadAllUsers,
    loadUsersSuccess,
    loadUsersFailure,
    setCurrentUser,
    logout,
    addUser,
    updateUser,
    deleteUser,
    login,
    loginSuccess,
    loginFailure,
    blockUser,
    unblockUser
} from './user.actions';

export interface UserState {
    users: User[];
    currentUser: User | null;
    error: string | null;
    loading: boolean;
}

export const initialState: UserState = {
    users: [],
    currentUser: null,
    error: null,
    loading: false,
};

export const userReducer = createReducer(
    initialState,
    on(login, state => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(loginSuccess, state => ({
        ...state,
        loading: false,
        error: null,
    })),
    on(loginFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(setCurrentUser, (state, { user }) => ({
        ...state,
        currentUser: user
    })),
    on(logout, state => ({
        ...state,
        currentUser: null
    })),
    on(loadAllUsers, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadUsersSuccess, (state, { users }) => ({
        ...state,
        loading: false,
        users,
        error: null
    })),
    on(loadUsersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(addUser, (state, { user }) => ({
        ...state,
        users: [...state.users, user]
    })),
    on(updateUser, (state, { user }) => ({
        ...state,
        users: state.users.map(u => u.id === user.id ? user : u)
    })),
    on(blockUser, (state, { id }) => ({
        ...state,
        users: state.users.map(u => u.id === id ? { ...u, isBlocked: true } : u)
    })),
    on(unblockUser, (state, { id }) => ({
        ...state,
        users: state.users.map(u => u.id === id ? { ...u, isBlocked: false } : u)
    })),
    on(deleteUser, (state, { id }) => ({
        ...state,
        users: state.users.filter(u => u.id !== id)
    }))
);

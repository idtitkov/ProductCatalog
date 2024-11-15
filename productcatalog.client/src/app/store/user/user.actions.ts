import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const login = createAction(
    '[User] Login',
    props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
    '[User] Login Success'
);

export const loginFailure = createAction(
    '[User] Login Failure',
    props<{ error: string }>()
);

export const setCurrentUser = createAction(
    '[User] Set Current User',
    props<{ user: User }>()
);

export const logout = createAction(
    '[User] Logout'
);

export const loadAllUsers = createAction(
    '[User] Load All Users'
);

export const loadUsersSuccess = createAction(
    '[User] Load Users Success',
    props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
    '[User] Load Users Failure',
    props<{ error: string }>()
);

export const addUser = createAction(
    '[User] Add User',
    props<{ user: User, password: string }>()
);

export const updateUser = createAction(
    '[User] Update User',
    props<{ user: User, password: string }>()
);

export const blockUser = createAction(
    '[User] Block User',
    props<{ id: string }>()
);

export const unblockUser = createAction(
    '[User] Unblock User',
    props<{ id: string }>()
);

export const deleteUser = createAction(
    '[User] Delete User',
    props<{ id: string }>()
);

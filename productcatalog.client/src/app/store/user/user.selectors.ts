import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('users');

export const selectAllUsers = createSelector(
    selectUserState,
    (state: UserState) => state.users
);

export const selectCurrentUser = createSelector(
    selectUserState,
    (state: UserState) => state.currentUser
);

export const selectLoading = createSelector(
    selectUserState,
    (state: UserState) => state.loading
);

export const selectError = createSelector(
    selectUserState,
    (state: UserState) => state.error
);

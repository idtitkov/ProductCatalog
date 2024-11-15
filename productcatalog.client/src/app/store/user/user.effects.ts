import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import {
    loadAllUsers,
    loadUsersSuccess,
    loadUsersFailure,
    addUser,
    updateUser,
    deleteUser,
    logout,
    setCurrentUser,
    login,
    loginFailure,
    loginSuccess,
    blockUser,
    unblockUser
} from './user.actions';

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions, private userService: UserService, private authService: AuthService) { }

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login),
            mergeMap(action =>
                this.authService.login(action.username, action.password).pipe(
                    mergeMap(response => {
                        const loggedIn = this.authService.isLoggedIn();
                        if (loggedIn) {
                            return of(loginSuccess());
                        } else {
                            return of(loginFailure({ error: 'Не удалось войти в систему.' }));
                        }
                    }),
                    catchError(error => {
                        const errorMessage = error.message || 'Ошибка при входе';
                        return of(loginFailure({ error: errorMessage }));
                    })
                )
            )
        )
    );

    loginSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginSuccess),
            mergeMap(() =>
                this.authService.getCurrentUser().pipe(
                    map(user => setCurrentUser({ user })),
                    catchError(error => {
                        console.error('Ошибка при получении текущего пользователя:', error);
                        return of(logout());
                    })
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logout),
            tap(() => {
                this.authService.logout();
            })
        ),
        { dispatch: false }
    );

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadAllUsers),
            mergeMap(() => this.userService.loadUsers().pipe(
                map(users => loadUsersSuccess({ users })),
                catchError(error => of(loadUsersFailure({ error: error.message })))
            ))
        )
    );

    addUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addUser),
            mergeMap(({ user, password }) => this.userService.addUser(user, password).pipe(
                map(newUser => loadAllUsers()),
                catchError(error => of(loadUsersFailure({ error: error.message })))
            ))
        )
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateUser),
            mergeMap(({ user, password }) => this.userService.updateUser(user, password).pipe(
                map(updatedUser => loadAllUsers()),
                catchError(error => of(loadUsersFailure({ error: error.message })))
            ))
        )
    );

    blockUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(blockUser),
            mergeMap(({ id }) =>
                this.userService.blockUser(id).pipe(
                    map(() => {
                        return loadAllUsers();
                    }),
                    catchError(error => of(loadUsersFailure({ error: error.message })))
                )
            )
        )
    );

    unblockUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(unblockUser),
            mergeMap(({ id }) =>
                this.userService.unblockUser(id).pipe(
                    map(() => {
                        return loadAllUsers();
                    }),
                    catchError(error => of(loadUsersFailure({ error: error.message })))
                )
            )
        )
    );

    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteUser),
            mergeMap(({ id }) => this.userService.deleteUser(id).pipe(
                map(() => loadAllUsers()),
                catchError(error => of(loadUsersFailure({ error: error.message })))
            ))
        )
    );
}

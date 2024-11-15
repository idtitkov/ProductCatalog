import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = '/api/users';

    constructor(private http: HttpClient) { }

    loadUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl).pipe(
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    addUser(user: User, password: string): Observable<User> {
        return this.http.post<User>(this.apiUrl, user, {
            params: { password }
        }).pipe(
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    updateUser(user: User, password: string): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}`, user, {
            params: { password }
        }).pipe(
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    deleteUser(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    blockUser(userId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${userId}/lock`, {}).pipe(
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    unblockUser(userId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${userId}/unlock`, {}).pipe(
            catchError(error => {
                return throwError(() => error);
            })
        );
    }
}

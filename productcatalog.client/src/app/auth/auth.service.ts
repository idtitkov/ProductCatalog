import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/account';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = { UserName: username, Password: password };
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, body).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    sessionStorage.removeItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('jwt');
  }

  private setToken(token: string): void {
    sessionStorage.setItem('jwt', token);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Что-то пошло не так; пожалуйста, попробуйте снова позже.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      errorMessage = `Ошибка ${error.status}: ${error.message}`;
    }
    console.error('Произошла ошибка:', error);
    return throwError(() => new Error(errorMessage));
  }
}

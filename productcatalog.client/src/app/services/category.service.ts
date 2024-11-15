import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'api/categories';

  constructor(private http: HttpClient) { }

  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(error => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  addNewCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError(error => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  updateExistingCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category).pipe(
      catchError(error => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  deleteCategoryById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => new Error(error.message));
      })
    );
  }
}

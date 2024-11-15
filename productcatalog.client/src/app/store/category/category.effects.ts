import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import {
  loadCategories,
  loadCategoriesSuccess,
  loadCategoriesFailure,
  addCategory,
  updateCategory,
  deleteCategory
} from './category.actions';

@Injectable()
export class CategoryEffects {
  constructor(private actions$: Actions, private categoryService: CategoryService) { }

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCategories),
      mergeMap(() =>
        this.categoryService.loadCategories().pipe(
          map(categories => loadCategoriesSuccess({ categories })),
          catchError(error => of(loadCategoriesFailure({ error: error.message })))
        )
      )
    )
  );

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCategory),
      mergeMap(action =>
        this.categoryService.addNewCategory(action.category).pipe(
          map(newCategory => loadCategories()),
          catchError(error => of(loadCategoriesFailure({ error: error.message })))
        )
      )
    )
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCategory),
      mergeMap(action =>
        this.categoryService.updateExistingCategory(action.category).pipe(
          map(updatedCategory => loadCategories()),
          catchError(error => of(loadCategoriesFailure({ error: error.message })))
        )
      )
    )
  );

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCategory),
      mergeMap(action =>
        this.categoryService.deleteCategoryById(action.id).pipe(
          map(() => loadCategories()),
          catchError(error => of(loadCategoriesFailure({ error: error.message })))
        )
      )
    )
  );
}

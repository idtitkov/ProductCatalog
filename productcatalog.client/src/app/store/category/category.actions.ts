import { createAction, props } from '@ngrx/store';
import { Category } from '../../models/category.model';

export const loadCategories = createAction(
    '[Category] Load Categories'
);

export const loadCategoriesSuccess = createAction(
    '[Category] Load Categories Success',
    props<{ categories: Category[] }>()
);

export const loadCategoriesFailure = createAction(
    '[Category] Load Categories Failure',
    props<{ error: string }>()
);

export const addCategory = createAction(
    '[Category] Add Category',
    props<{ category: Category }>()
);

export const updateCategory = createAction(
    '[Category] Update Category',
    props<{ category: Category }>()
);

export const deleteCategory = createAction(
    '[Category] Delete Category',
    props<{ id: number }>()
);

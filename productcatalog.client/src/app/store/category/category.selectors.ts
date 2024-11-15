import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from './category.reducer';
import { Category } from '../../models/category.model';

export const selectCategoryState = createFeatureSelector<CategoryState>('categories');

export const selectCategories = createSelector(
    selectCategoryState,
    (state: CategoryState) => state.categories
);

export const selectCategoryById = (id: number) => createSelector(
    selectCategories,
    (categories: Category[]) => categories.find(category => category.id === id)
);

export const selectLoading = createSelector(
    selectCategoryState,
    (state: CategoryState) => state.loading
);

export const selectError = createSelector(
    selectCategoryState,
    (state: CategoryState) => state.error
);

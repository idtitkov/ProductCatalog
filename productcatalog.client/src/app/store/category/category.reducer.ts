import { createReducer, on } from '@ngrx/store';
import {
  loadCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  loadCategoriesSuccess,
  loadCategoriesFailure
} from './category.actions';
import { Category } from '../../models/category.model';

export interface CategoryState {
  categories: Category[];
  error: string | null;
  loading: boolean;
}

export const initialState: CategoryState = {
  categories: [],
  error: null,
  loading: false,
};

export const categoryReducer = createReducer(
  initialState,
  on(loadCategories, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    loading: false,
    categories,
    error: null
  })),
  on(loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(addCategory, (state, { category }) => ({
    ...state,
    categories: [...state.categories, category]
  })),
  on(updateCategory, (state, { category }) => ({
    ...state,
    categories: state.categories.map(c => (c.id === category.id ? category : c))
  })),
  on(deleteCategory, (state, { id }) => ({
    ...state,
    categories: state.categories.filter(c => c.id !== id)
  }))
);

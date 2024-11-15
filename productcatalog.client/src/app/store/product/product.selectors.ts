import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';
import { Product } from '../../models/product.model';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectProducts = createSelector(
    selectProductState,
    (state: ProductState) => state.products
);

export const selectProductById = (id: number) => createSelector(
    selectProducts,
    (products: Product[]) => products.find(product => product.id === id)
);

export const selectLoading = createSelector(
    selectProductState,
    (state: ProductState) => state.loading
);

export const selectError = createSelector(
    selectProductState,
    (state: ProductState) => state.error
);

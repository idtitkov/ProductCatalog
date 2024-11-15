import { createReducer, on } from '@ngrx/store';
import { loadProducts, loadProductsSuccess, loadProductsFailure, addProduct, updateProduct, deleteProduct } from './product.actions';
import { Product } from '../../models/product.model';

export interface ProductState {
    products: Product[];
    error: string | null;
    loading: boolean;
}

export const initialState: ProductState = {
    products: [],
    error: null,
    loading: false,
};

export const productReducer = createReducer(
    initialState,
    on(loadProducts, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadProductsSuccess, (state, { products }) => ({
        ...state,
        loading: false,
        products: products,
        error: null
    })),
    on(loadProductsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(addProduct, (state, { product }) => ({
        ...state,
        products: [...state.products, product]
    })),
    on(updateProduct, (state, { product }) => ({
        ...state,
        products: state.products.map(p => (p.id === product.id ? product : p))
    })),
    on(deleteProduct, (state, { id }) => ({
        ...state,
        products: state.products.filter(p => p.id !== id)
    }))
);

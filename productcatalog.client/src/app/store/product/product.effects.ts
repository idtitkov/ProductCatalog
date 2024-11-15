import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, catchError, map, mergeMap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFailure,
  addProduct,
  updateProduct,
  deleteProduct
} from './product.actions';

@Injectable()
export class ProductEffects {
  constructor(private actions$: Actions, private productService: ProductService) { }

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      mergeMap(() =>
        this.productService.loadProducts().pipe(
          map(products => loadProductsSuccess({ products })),
          catchError(error => of(loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProduct),
      mergeMap(action =>
        this.productService.addNewProduct(action.product).pipe(
          map(newProduct => loadProducts()),
          catchError(error => of(loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProduct),
      mergeMap(action =>
        this.productService.updateExistingProduct(action.product).pipe(
          map(updatedProduct => loadProducts()),
          catchError(error => of(loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProduct),
      mergeMap(action =>
        this.productService.deleteProductById(action.id).pipe(
          map(() => loadProducts()),
          catchError(error => of(loadProductsFailure({ error: error.message })))
        )
      )
    )
  );
}

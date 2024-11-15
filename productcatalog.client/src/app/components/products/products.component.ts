import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { selectProducts } from '../../store/product/product.selectors';
import { selectCategories } from '../../store/category/category.selectors';
import {
  loadProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../store/product/product.actions';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { loadCategories } from '../../store/category/category.actions';
import { selectCurrentUser } from '../../store/user/user.selectors';
import { UserRole } from '../../models/user-role.model';
import { loginSuccess, logout } from '../../store/user/user.actions';

@Component({
  selector: 'app-catalog',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  categories$: Observable<Category[]>;
  userRole$: Observable<UserRole | null>;

  productDialog: boolean = false;
  product!: Product;
  selectedProducts!: Product[] | null;
  productSubmitted: boolean = false;

  userRoles = UserRole;

  private store = inject(Store);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  constructor() {
    this.products$ = this.store.select(selectProducts);
    this.categories$ = this.store.select(selectCategories);
    this.userRole$ = this.store.select(selectCurrentUser).pipe(
      map(user => user ? user.role : null)
    );;
  }

  ngOnInit(): void {
    this.store.dispatch(loginSuccess());
    this.store.dispatch(loadProducts());
    this.store.dispatch(loadCategories());
  }

  addNewProduct(): void {
    this.product = {} as Product;
    this.productSubmitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product): void {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить продукт "' + product.name + '"?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      accept: () => {
        this.store.dispatch(deleteProduct({ id: product.id }));
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Продукт удален', life: 3000 });
      }
    });
  }

  deleteSelectedProducts(): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить выделенные продукты?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      accept: () => {
        this.selectedProducts?.forEach(product => {
          this.store.dispatch(deleteProduct({ id: product.id }));
        });
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Продукт удален', life: 3000 });
      }
    });
  }

  saveProduct(): void {
    this.productSubmitted = true;

    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.store.dispatch(updateProduct({ product: this.product }));
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Продукт отредактирован', life: 3000 });
      } else {
        this.store.dispatch(addProduct({ product: this.product }));
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Продукт создан', life: 3000 });
      }

      this.productDialog = false;
      this.product = {} as Product;
    }
  }

  hideProductDialog(): void {
    this.productDialog = false;
    this.productSubmitted = false;
  }

  editCategories(): void {
    this.router.navigate(['/categories']);
  }

  logOut(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}

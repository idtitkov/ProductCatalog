import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { selectCategories } from '../../store/category/category.selectors';
import { Category } from '../../models/category.model';
import {
  addCategory,
  deleteCategory,
  loadCategories,
  updateCategory
} from '../../store/category/category.actions';
import { selectCurrentUser } from '../../store/user/user.selectors';
import { UserRole } from '../../models/user-role.model';
import { loginSuccess, logout } from '../../store/user/user.actions';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories$: Observable<Category[]>;
  userRole$: Observable<UserRole | null>;

  categoryDialog: boolean = false;
  category!: Category;
  selectedCategories!: Category[] | null;
  categorySubmitted: boolean = false;

  userRoles = UserRole;

  private store = inject(Store);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  constructor() {
    this.categories$ = this.store.select(selectCategories);
    this.userRole$ = this.store.select(selectCurrentUser).pipe(
      map(user => user ? user.role : this.userRoles.User)
    );;
  }

  ngOnInit(): void {
    this.store.dispatch(loginSuccess());
    this.store.dispatch(loadCategories());
  }

  addNewCategory(): void {
    this.category = {} as Category;
    this.categorySubmitted = false;
    this.categoryDialog = true;
  }

  editCategory(category: Category): void {
    this.category = { ...category };
    this.categoryDialog = true;
  }

  deleteCategory(category: Category): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить категорию "' + category.name + '"?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      accept: () => {
        this.store.dispatch(deleteCategory({ id: category.id }));
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Категория удалена', life: 3000 });
      }
    });
  }

  deleteSelectedCategories(): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить выделенные категории?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      accept: () => {
        this.selectedCategories?.forEach(category => {
          this.store.dispatch(deleteCategory({ id: category.id }));
        });
        this.selectedCategories = null;
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Категория удалена', life: 3000 });
      }
    });
  }

  saveCategory(): void {
    this.categorySubmitted = true;

    if (this.category.name?.trim()) {
      if (this.category.id) {
        this.store.dispatch(updateCategory({ category: this.category }));
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Категория отредактирована', life: 3000 });
      } else {
        this.store.dispatch(addCategory({ category: this.category }));
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Категория создана', life: 3000 });
      }

      this.categoryDialog = false;
      this.category = {} as Category;
    }
  }

  hideCategoryDialog(): void {
    this.categoryDialog = false;
    this.categorySubmitted = false;
  }

  editProducts(): void {
    this.router.navigate(['/products']);
  }

  logOut(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}

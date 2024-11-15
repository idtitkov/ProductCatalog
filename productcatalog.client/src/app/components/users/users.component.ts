import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../models/user.model';
import { UserRole } from '../../models/user-role.model';
import {
  addUser,
  blockUser,
  deleteUser,
  loadAllUsers,
  loginSuccess,
  logout,
  unblockUser,
  updateUser
} from '../../store/user/user.actions';
import { selectCurrentUser, selectAllUsers } from '../../store/user/user.selectors';
import { SelectButtonOptionClickEvent } from 'primeng/selectbutton';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users$: Observable<User[]>;
  userId$: Observable<string>;

  userDialog: boolean = false;
  user!: User;
  password: string | null = null;
  userSubmitted: boolean = false;

  private store = inject(Store);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  constructor() {
    this.users$ = this.store.select(selectAllUsers);
    this.userId$ = this.store.select(selectCurrentUser).pipe(
      map(user => user ? user.id : "")
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loginSuccess());
    this.store.dispatch(loadAllUsers());
  }

  addNewUser(): void {
    this.user = {} as User;
    this.userSubmitted = false;
    this.userDialog = true;
  }

  editUser(user: User): void {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: User): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить пользователя "' + user.name + '"?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      accept: () => {
        this.store.dispatch(deleteUser({ id: user.id }));
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Пользователь удален', life: 3000 });
      }
    });
  }

  saveUser(): void {
    this.userSubmitted = true;

    if (this.user) {
      if (this.user.id) {
        this.store.dispatch(updateUser({ user: this.user, password: this.password! }));
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Пользователь изменен', life: 3000 });
      } else {
        this.store.dispatch(addUser({ user: this.user, password: this.password! }));
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Пользователь создан', life: 3000 });
      }

      this.userDialog = false;
      this.user = {} as User;
      this.password = null;
    }
  }

  hideUserDialog(): void {
    this.userDialog = false;
    this.userSubmitted = false;
  }

  blockUser(event: SelectButtonOptionClickEvent, user: User) {
    var toBlock = event.option.value as boolean;
    if (toBlock) {
      this.store.dispatch(blockUser({ id: user.id }));
    } else {
      this.store.dispatch(unblockUser({ id: user.id }));
    }
  }

  logOut(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}

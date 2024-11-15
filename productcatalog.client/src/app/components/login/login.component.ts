import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { filter, Observable, take } from 'rxjs';
import { selectCurrentUser, selectError, selectLoading } from '../../store/user/user.selectors';
import { login } from '../../store/user/user.actions';
import { User } from '../../models/user.model';
import { UserRole } from '../../models/user-role.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  currentUser$: Observable<User | null>;

  constructor(private store: Store, private router: Router) {
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  onSubmit(loginForm: NgForm): void {
    if (loginForm.valid) {
      this.store.dispatch(login({ username: this.username, password: this.password }));

      this.currentUser$.pipe(
        filter(user => user !== null),
        take(1)).subscribe(user => {
          if (user) {
            if (user.role === UserRole.Admin) {
              this.router.navigate(['/users']);
            } else {
              this.router.navigate(['/products']);
            }
          }
        });
    }
  }
}

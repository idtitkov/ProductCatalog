import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

import { selectCurrentUser } from '../store/user/user.selectors';
import { UserRole } from '../models/user-role.model';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private store: Store, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        const requiredRoles = route.data["roles"] as UserRole[];

        return this.store.select(selectCurrentUser).pipe(
            map(user => {
                const authorized = requiredRoles.includes(user!.role);
                if (authorized) {
                    return true;
                } else {
                    this.router.navigate(['/login']);
                    return false;
                }
            })
        );
    }
}

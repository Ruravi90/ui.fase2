import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable()
export class AlwaysAuthGuard implements CanActivate, CanActivateChild {
  constructor(private uS: UserService, private router: Router) {}

  canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.checkAuth();
  }

  canActivateChild(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.checkAuth();
  }

  private checkAuth(): Observable<boolean | UrlTree> {
    if (this.uS.isLogin()) {
      return of(true);
    }

    return this.uS.ensureSession().pipe(
      map(user => user ? true : this.router.createUrlTree(['/login'])),
      catchError(() => of(this.router.createUrlTree(['/login'])))
    );
  }
}

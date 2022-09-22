import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class AlwaysAuthGuard implements CanActivate, CanActivateChild {
  constructor(private uS: UserService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (!this.uS.isLogin()) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }
    return true;
  }

  canActivateChild(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      if (!this.uS.isLogin()) {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }
      return true;
  }
}

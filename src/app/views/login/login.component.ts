import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services';
import { User } from '../../models';

declare var iziToast: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  user: User = new User();
  isBusy: Boolean = false;
  isAuthorized: Boolean | null = null;
  constructor(private uS: UserService, private router: Router) {
    localStorage.removeItem('currentUser');
  }

  ngOnInit() {
    this.isBusy = false;
  }

  login() {
    this.isBusy = true;
    this.uS.login(this.user).subscribe(r => {
      this.isAuthorized = true;
      localStorage.setItem('currentUser', JSON.stringify(r.success));
      this.router.navigate(['/page']);
    }, error => {
      this.isBusy = false;
      this.isAuthorized = false;
      iziToast.show({
        message: 'Usuario no autorizado',
        color: 'red', // blue, red, green, yellow
      });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services';
import { User } from '../../models';
import Swal from 'sweetalert2';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    imports: [FormsModule],
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  public user: User = new User();
  isBusy: Boolean = false;
  isAuthorized: Boolean | null = null;

  constructor(private uS: UserService, private router: Router) {}

  ngOnInit() {
    this.isBusy = false;
  }

  login() {
    this.isBusy = true;
    this.uS.login(this.user).subscribe({
      next: (response) => {
        if (response && response.success === false) {
            // Caso donde el backend regresa 200 pero falló el login
            this.handleLoginError();
        } else {
            this.isAuthorized = true;
            this.router.navigate(['/page']);
        }
      }, 
      error: (err) => {
        console.error("LOGIN ERROR:", err);
        this.handleLoginError();
      }
    });
  }

  private handleLoginError() {
      this.isBusy = false;
      this.isAuthorized = false;
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Usuario no autorizado',
        showConfirmButton: false,
        timer: 3000,
      });
  }
}

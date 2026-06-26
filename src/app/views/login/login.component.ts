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
            
            // Verificar si es dueño del SaaS (super_admin)
            const isSuperAdmin = this.uS.currentUser?.roles?.some(r => r.slug === 'super_admin');
            
            if (isSuperAdmin) {
              this.router.navigate(['/saas/dashboard']);
            } else {
              this.router.navigate(['/page']);
            }
        }
      },
      error: (err) => {
        console.error("LOGIN ERROR:", err);
        // Si hay error de CORS/Fetch por cookies inválidas, el status suele ser 0
        if (err && err.status === 0) {
            this.clearCookiesAndReload();
        } else {
            this.handleLoginError();
        }
      }
    });
  }

  private clearCookiesAndReload() {
    this.isBusy = false;
    
    // El frontend no puede borrar la cookie de sesión porque es HttpOnly.
    // Llamamos al logout del backend para que él envíe la instrucción de caducar ambas cookies.
    this.uS.logout().subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Limpiando sesión inválida...',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      },
      error: () => {
        window.location.reload();
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

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

declare var iziToast: any;

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule]
})
export class RegisterComponent {

  form = {
    tenant_name: '',
    domain: '',
    name: '',
    username: '',
    email: '',
    password: '',
    c_password: ''
  };

  loading = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  formatDomain() {
    // Basic formatting for subdomain: lowercase, no spaces, no special chars
    this.form.domain = this.form.domain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  onSubmit() {
    if (this.form.password !== this.form.c_password) {
      this.toastError('Las contraseñas no coinciden');
      return;
    }
    if (!this.form.tenant_name || !this.form.domain || !this.form.name || !this.form.username || !this.form.email || !this.form.password) {
      this.toastError('Todos los campos son obligatorios');
      return;
    }

    this.loading = true;
    this.userService.registerTenant(this.form).subscribe({
      next: (res) => {
        this.loading = false;
        iziToast.success({
          title: '¡Bienvenido!',
          message: 'Tu clínica ha sido creada exitosamente.',
          position: 'topRight'
        });
        this.router.navigate(['/page/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        let msg = 'Ocurrió un error al registrar la clínica.';
        if (err.error && err.error.message) {
          msg = err.error.message;
        } else if (err.error && typeof err.error.error === 'string') {
          msg = err.error.error;
        }
        this.toastError(msg);
      }
    });
  }

  private toastError(message: string) {
    if (typeof iziToast !== 'undefined') {
      iziToast.error({
        title: 'Error',
        message: message,
        position: 'topRight'
      });
    } else {
      alert(message);
    }
  }
}

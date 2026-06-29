import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

declare var iziToast: any;

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule]
})
export class RegisterComponent implements OnInit {

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
  planId: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.planId = params['plan'];
    });
  }

  formatDomain() {
    // Basic formatting for subdomain: lowercase, no spaces, no special chars
    this.form.domain = this.form.domain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  onSubmit() {
    if (this.form.password !== this.form.c_password) {
      this.toastError('Las contraseñas no coinciden');
      return;
    }
    
    // Auto-generate domain if not provided in the UI
    if (!this.form.domain && this.form.tenant_name) {
      this.form.domain = this.form.tenant_name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    }

    if (!this.form.tenant_name || !this.form.domain || !this.form.name || !this.form.username || !this.form.email || !this.form.password) {
      this.toastError('Todos los campos son obligatorios');
      return;
    }

    this.loading = true;
    this.userService.registerTenant(this.form).subscribe({
      next: (res) => {
        this.loading = false;
        
        // Check if token returned and save it so they are logged in!
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        }

        Swal.fire({
          title: '¡Bienvenido!',
          text: 'Tu clínica ha sido creada exitosamente.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        if (this.planId) {
          this.router.navigate(['/admin/subscription']);
        } else {
          this.router.navigate(['/page/dashboard']);
        }
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
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpenwaService } from '../../../services/openwa.service';
import { RoleService } from '../../../services';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-openwa-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './openwa-config.component.html',
  styleUrl: './openwa-config.component.scss',
})
export class OpenwaConfigComponent implements OnInit {
  sessions: any[] = [];
  roles: any[] = [];
  sessionForm: FormGroup;
  showModal = false;
  qrCodeUrl: string | null = null;
  loading = false;

  constructor(
    private openwaService: OpenwaService,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.sessionForm = this.fb.group({
      session_id: ['', Validators.required],
      name: ['', Validators.required],
      role_ids: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.loadSessions();
    this.loadRoles();
  }

  loadSessions() {
    this.loading = true;
    this.openwaService.getSessions().subscribe({
      next: (data) => {
        this.sessions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadRoles() {
    this.roleService.get().subscribe((data: any) => {
      this.roles = data;
    });
  }

  openAddModal() {
    this.sessionForm.reset();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.qrCodeUrl = null;
  }

  saveSession() {
    if (this.sessionForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos', 'error');
      return;
    }

    this.openwaService.createSession(this.sessionForm.value).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Sesión creada correctamente', 'success');
        this.closeModal();
        this.loadSessions();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo crear la sesión', 'error');
        console.error(err);
      }
    });
  }

  startSession(id: number) {
    this.openwaService.startSession(id).subscribe({
      next: () => {
        Swal.fire('Iniciando', 'La sesión está iniciando, en un momento obtendremos el estado', 'info');
        setTimeout(() => this.loadSessions(), 3000);
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo iniciar la sesión', 'error');
      }
    });
  }

  getQrCode(id: number) {
    this.openwaService.getQr(id).subscribe({
      next: (data: any) => {
        if (data.qrUrl) {
          this.qrCodeUrl = data.qrUrl;
          this.showModal = true;
        } else {
          Swal.fire('Info', 'El QR aún no está listo o la sesión ya está conectada', 'info');
        }
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo obtener el QR', 'error');
      }
    });
  }

  deleteSession(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.openwaService.deleteSession(id).subscribe({
          next: () => {
            Swal.fire('Borrado!', 'La sesión ha sido eliminada.', 'success');
            this.loadSessions();
          },
          error: (err) => {
            Swal.fire('Error', 'Hubo un problema al borrar la sesión', 'error');
          }
        });
      }
    });
  }
}

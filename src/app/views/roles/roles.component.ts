import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RoleService, PermissionService } from '../../services';
import { Role } from '../../models';

import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  public isEdit = false;
  
  public roles: Role[] = [];
  public rol: Role = new Role();
  public showModalRol = false;
  public loadingRoles = false;



  constructor(
    private rS: RoleService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.loadingRoles = true;
    this.rS.get().subscribe({
      next: (r: any) => {
        this.roles = r;
        this.loadingRoles = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingRoles = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Roles ---

  addRol() {
    this.router.navigate(['/admin/roles/create']);
  }

  editRol(r: Role) {
    this.router.navigate(['/admin/roles', r.id, 'edit']);
  }

  deleteRol(r: Role) {
    Swal.fire({
      title: '¿Eliminar rol?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará el rol <b>${r.name}</b>. Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonColor: '#bdc3c7',
      confirmButtonColor: '#e85d5d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rS.delete(r.id!).subscribe(() => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Rol eliminado', showConfirmButton: false, timer: 2000 });
          this.getRoles();
        });
      }
    });
  }


}

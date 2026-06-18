import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RoleService, PermissionService } from '../../services';
import { Role, Permission } from '../../models';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  public isEdit = false;
  
  public roles: Role[] = [];
  public rol: Role = new Role();
  public showModalRol = false;
  public loadingRoles = false;

  public permissions: Permission[] = [];
  public comboPermissions$!: Observable<Permission[]>;
  public permission: Permission = new Permission();
  public showModalPermission = false;
  public loadingPermissions = false;

  constructor(
    private rS: RoleService, 
    private pS: PermissionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.getPermissions();
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

  getPermissions() {
    this.loadingPermissions = true;
    this.pS.get().subscribe({
      next: (r: any) => {
        this.permissions = r;
        this.loadingPermissions = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingPermissions = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Roles ---

  addRol() {
    this.isEdit = false;
    this.comboPermissions$ = this.pS.get();
    this.rol = new Role();
    this.showModalRol = true;
    this.cdr.detectChanges();
  }

  editRol(r: Role) {
    this.isEdit = true;
    this.rS.getById(r.id!).subscribe(result => {
      this.rol = result;
      this.comboPermissions$ = this.pS.get();
      this.showModalRol = true;
      this.cdr.detectChanges();
    });
  }

  closeModalRol() {
    this.showModalRol = false;
    this.cdr.detectChanges();
  }

  saveRol() {
    if (this.isEdit) {
      this.rS.put(this.rol).subscribe(() => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Rol actualizado', showConfirmButton: false, timer: 2000 });
        this.closeModalRol();
        this.getRoles();
      });
    } else {
      this.rS.post(this.rol).subscribe(() => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Rol creado', showConfirmButton: false, timer: 2000 });
        this.closeModalRol();
        this.getRoles();
      });
    }
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

  // --- Permissions ---

  addPermission() {
    this.isEdit = false;
    this.permission = new Permission();
    this.showModalPermission = true;
    this.cdr.detectChanges();
  }

  editPermission(p: Permission) {
    this.isEdit = true;
    this.pS.getById(p.id!).subscribe(result => {
      this.permission = result;
      this.showModalPermission = true;
      this.cdr.detectChanges();
    });
  }

  closeModalPermission() {
    this.showModalPermission = false;
    this.cdr.detectChanges();
  }

  savePermission() {
    if (this.isEdit) {
      this.pS.put(this.permission).subscribe(() => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Permiso actualizado', showConfirmButton: false, timer: 2000 });
        this.closeModalPermission();
        this.getPermissions();
      });
    } else {
      this.pS.post(this.permission).subscribe(() => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Permiso creado', showConfirmButton: false, timer: 2000 });
        this.closeModalPermission();
        this.getPermissions();
      });
    }
  }

  deletePermission(p: Permission) {
    Swal.fire({
      title: '¿Eliminar permiso?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará el permiso <b>${p.name}</b>. Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonColor: '#bdc3c7',
      confirmButtonColor: '#e85d5d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if(result.isConfirmed) {
        this.pS.delete(p.id!).subscribe(() => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Permiso eliminado', showConfirmButton: false, timer: 2000 });
          this.getPermissions();
        });
      }
    });
  }
}

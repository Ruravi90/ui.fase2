import { Component, OnInit } from '@angular/core';
import { RoleService, PermissionService } from '../../services';
import { Role, Permission } from '../../models';

import swal from 'sweetalert2';
import { isUndefined } from 'util';
import { Subject, Observable } from 'rxjs';
declare var $: any, iziToast: any;

@Component({
  templateUrl: 'roles.component.html'
})
export class RolesComponent implements OnInit {
  public isEdit =  false;
  public roles$: Observable<Role[]>;
  public rol: Role = new Role();
  public permissions$:  Observable<Permission[]>;
  public comboPermissions$: Observable<Permission[]>;
  public permission: Permission = new Permission();

  constructor(private rS: RoleService, private pS: PermissionService) {
    this.getRoles();
    this.getPermissions();
  }

  ngOnInit(): void {
    // generate random values for mainChart
    const that = this;
    $('#modalRol').on('hidden.bs.modal', function (event) {
      that.getRoles();
    });

    $('#modalPermission').on('hidden.bs.modal', function (event) {
      that.getPermissions();
    });
  }

  getRoles() {
    this.roles$ = this.rS.get();
  }

  addRol() {
    this.isEdit = false;
    this.comboPermissions$ = this.pS.get();
    this.rol = new Role();
    $('#modalRol').modal('show');
  }

  saveRol() {
    if (this.isEdit) {
      this.rS.put(this.rol).subscribe(result => {
        iziToast.show({
          message: 'Registro actualizado'
        });
        $('#modalRol').modal('hide');
      });
    } else {
      this.rS.post(this.rol).subscribe(result => {
        iziToast.show({
          message: 'Registro creado'
        });
        $('#modalRol').modal('hide');
      });
    }
  }

  editRol(r: Role) {
    this.rS.getById(r.id).subscribe(result => {
      this.isEdit = true;
      this.rol = result;
      this.comboPermissions$ = this.pS.get();
      $('#modalRol').modal('show');
    });
  }

  async deleteRol(r: Role) {
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de continuar',
      icon: 'question',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      this.pS.delete(r.id).subscribe(result => {
        $('#modalRol').modal('hide');
      });
    });
  }

  getPermissions() {
    this.permissions$ = this.pS.get();
  }

  addPermission() {
    this.isEdit = false;
    this.permission = new Permission();
    $('#modalPermission').modal('show');
  }
  savePermission() {
    if (this.isEdit) {
      this.pS.put(this.permission).subscribe(result => {
        iziToast.show({
          message: 'Registro actualizado'
      });
        $('#modalPermission').modal('hide');
      });
    } else {
      this.pS.post(this.permission).subscribe(result => {
        iziToast.show({
          message: 'Registro creado'
        });
        $('#modalPermission').modal('hide');
      });
    }
  }
  editPermission(p: Permission) {
    this.pS.getById(p.id).subscribe(result => {
      this.isEdit = true;
      this.permission = result;
      $('#modalPermission').modal('show');
    });
  }
  async deletePermission(p: Permission) {
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de continuar',
      icon: 'question',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      this.pS.delete(p.id).subscribe(result => {
        iziToast.show({
          message: 'Registro eliminado'
        });
        $('#modalPermission').modal('hide');
      });
    });
  }
}

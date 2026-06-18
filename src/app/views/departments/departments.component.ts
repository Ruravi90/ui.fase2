import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DepartmentService } from '../../services';
import { Department } from '../../models';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationModule],
  templateUrl: './departments.component.html'
})
export class DepartmentsComponent implements OnInit {
  public departments: Department[] = [];
  public item: Department = new Department();
  public isEdit = false;

  public loading = false;
  public showModal = false;

  constructor(
    private dS: DepartmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    this.loading = true;
    this.dS.get().subscribe({
      next: (r: any) => {
        this.departments = r;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  add() {
    this.isEdit = false;
    this.item = new Department();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  update(_item: Department) {
    this.isEdit = true;
    this.loading = true;

    this.dS.getById(_item.id!).subscribe({
      next: (r: any) => {
        this.item = r;
        this.loading = false;
        this.showModal = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  save() {
    if (this.isEdit) {
      this.dS.put(this.item).subscribe(() => {
        this.closeModal();
        this.getDepartments();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Departamento actualizado',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else {
      this.dS.post(this.item).subscribe(() => {
        this.closeModal();
        this.getDepartments();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Departamento creado',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  delete(_item: Department) {
    Swal.fire({
      title: '¿Eliminar departamento?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará el departamento <b>${_item.name}</b>. Esta acción no se puede deshacer.</p>`,
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
        this.dS.delete(_item.id!).subscribe(() => {
          this.getDepartments();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Departamento eliminado',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
    });
  }
}

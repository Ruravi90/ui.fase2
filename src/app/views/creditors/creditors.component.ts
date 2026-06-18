import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CreditorService } from '../../services';
import { Creditor } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-creditors',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationModule],
  templateUrl: './creditors.component.html'
})
export class CreditorsComponent implements OnInit {
  public creditors: Creditor[] = [];
  public model: Creditor = new Creditor();
  public isEdit = false;

  public loading = false;
  public showModal = false;

  constructor(
    private cS: CreditorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCreditors();
  }

  getCreditors() {
    this.loading = true;
    this.cS.get().subscribe({
      next: (r: any) => {
        this.creditors = r;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  add(): void {
    this.isEdit = false;
    this.model = new Creditor();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  edit(c: Creditor): void {
    this.isEdit = true;
    this.loading = true;

    this.cS.getById(c.id!).subscribe({
      next: (r: any) => {
        this.model = r;
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
      this.cS.put(this.model).subscribe({
        next: () => {
          this.closeModal();
          this.getCreditors();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Proveedor actualizado',
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'No fue posible actualizar el registro',
            showConfirmButton: false,
            timer: 3000
          });
        }
      });
    } else {
      this.cS.post(this.model).subscribe({
        next: () => {
          this.closeModal();
          this.getCreditors();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Proveedor creado',
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'No fue posible crear el registro',
            showConfirmButton: false,
            timer: 3000
          });
        }
      });
    }
  }

  delete(c: Creditor) {
    Swal.fire({
      title: '¿Eliminar proveedor?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará al proveedor <b>${c.business_name}</b>. Esta acción no se puede deshacer.</p>`,
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
        this.cS.delete(c.id!).subscribe(() => {
          this.getCreditors();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Registro eliminado',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
    });
  }
}

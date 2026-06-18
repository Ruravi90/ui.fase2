import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PillsInventoryService, TypeService } from '../../services';
import { PillsInventory, _Type } from '../../models';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-pills-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PaginationModule],
  templateUrl: './pills_inventory.component.html'
})
export class PillsInventoryComponent implements OnInit {
  public inventory: PillsInventory[] = [];
  public cmbPills$!: Observable<_Type[]>;
  public item: PillsInventory = new PillsInventory();
  public isEdit = false;
  
  public loading = false;
  public showModal = false;

  constructor(
    private pS: PillsInventoryService, 
    private tS: TypeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCatlog();
  }

  getCatlog() {
    this.loading = true;
    this.pS.getAll().subscribe({
      next: (r: any) => {
        this.inventory = r;
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
    this.item = new PillsInventory();
    this.cmbPills$ = this.tS.getAll('cat_pills');
    this.showModal = true;
    this.cdr.detectChanges();
  }

  update(_item: PillsInventory) {
    this.isEdit = true;
    this.cmbPills$ = this.tS.getAll('cat_pills');
    this.loading = true;
    
    this.pS.getById(_item.id!).subscribe({
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
    this.item.pill_id = this.item.pill?.id;
    if (this.isEdit) {
      this.pS.put(this.item).subscribe(() => {
        this.closeModal();
        this.getCatlog();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Stock actualizado',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else {
      this.pS.post(this.item).subscribe(() => {
        this.closeModal();
        this.getCatlog();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Stock creado',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  delete(_item: _Type) {
    Swal.fire({
      title: '¿Eliminar del inventario?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará este registro de inventario. Esta acción no se puede deshacer.</p>`,
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
        this.pS.delete(_item.id!).subscribe(() => {
          this.getCatlog();
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

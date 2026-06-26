import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductsInventaryService, TypeService } from '../../services';
import { ProductsInventory, _Type } from '../../models';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-products-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PaginationModule],
  templateUrl: './products_inventory.component.html'
})
export class ProductsInventoryComponent implements OnInit {
  public inventory: ProductsInventory[] = [];
  public cmbProducts$!: Observable<_Type[]>;
  public item: ProductsInventory = new ProductsInventory();
  public isEdit = false;

  public loading = false;
  public showModal = false;

  constructor(
    private pS: ProductsInventaryService, 
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

  getStockStatus(count?: number): string {
    const c = count || 0;
    if (c > 20) return '#27ae60'; // Green - Healthy
    if (c > 5) return '#f39c12';  // Orange - Warning
    return '#e74c3c';                 // Red - Critical
  }

  add() {
    this.isEdit = false;
    this.item = new ProductsInventory();
    this.cmbProducts$ = this.tS.getAll('cat_products');
    this.showModal = true;
    this.cdr.detectChanges();
  }

  update(_item: ProductsInventory) {
    this.isEdit = true;
    this.cmbProducts$ = this.tS.getAll('cat_products');
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
    this.item.product_id = this.item.product?.id;
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

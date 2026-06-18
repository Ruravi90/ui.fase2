import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TypeService } from '../../services';
import { _Type, CatPackage, Paginate } from '../../models';

import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cat-package',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationModule, NgSelectModule],
  templateUrl: './cat_package.component.html'
})
export class CatPackageComponent implements OnInit {
  public nameCalog = 'cat_packages';
  public catalog: CatPackage[] = [];
  public elements: _Type[] = [];
  public element: _Type = new _Type();
  public item: CatPackage = new CatPackage();
  public isEdit = false;
  public optElements = 'na';
  public filterChanged: Subject<void> = new Subject<void>();
  public paginate: Paginate = new Paginate();
  public filters: any = {
    perPage: 15,
    name: ''
  };

  public loading = false;
  public showModal = false;

  constructor(private tS: TypeService, private cdr: ChangeDetectorRef) {
    this.filterChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => this.getCatlog());
  }

  ngOnInit(): void {
    this.getCatlog();
  }

  getCatlog() {
    this.loading = true;
    this.tS.paginate(this.nameCalog, this.filters).subscribe({
      next: (r: any) => {
        this.paginate = r;
        this.catalog = r.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  pageChanged(event: any) {
    this.loading = true;
    this.tS.getForUrl(this.nameCalog, event.page, this.filters.perPage).subscribe({
      next: (r: any) => {
        this.paginate = r;
        this.catalog = r.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterName(event: any) {
    this.filterChanged.next(event);
  }

  addItem() {
    this.isEdit = false;
    this.item = new CatPackage();
    this.optElements = 'na';
    this.elements = [];
    this.element = new _Type();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  updateItem(_item: CatPackage) {
    this.isEdit = true;
    this.loading = true;
    this.tS.getById(this.nameCalog, _item.id!).subscribe({
      next: (r: any) => {
        this.item = r;
        this.optElements = 'na';
        this.elements = [];
        this.element = new _Type();
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
      this.tS.put(this.nameCalog, this.item).subscribe(() => {
        this.closeModal();
        this.getCatlog();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Paquete actualizado',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else {
      this.tS.post(this.nameCalog, this.item).subscribe(() => {
        this.closeModal();
        this.getCatlog();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Paquete creado',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  deleteItem(_item: CatPackage) {
    Swal.fire({
      title: '¿Eliminar paquete?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará el paquete <strong>${_item.name}</strong>. Esta acción no se puede deshacer.</p>`,
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
        this.tS.delete(this.nameCalog, _item.id!).subscribe(() => {
          this.getCatlog();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Paquete eliminado',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
    });
  }

  changeOptions() {
    this.element = new _Type();
    this.getElements();
  }

  getElements() {
    let _name = '';
    if (this.optElements === 'pill') {
      _name += 'cat_pills';
    } else if (this.optElements === 'products') {
      _name += 'cat_products';
    } else {
      this.elements = [];
      return;
    }

    this.tS.getAll(_name).subscribe((r: any) => {
      this.elements = r;
      this.cdr.detectChanges();
    });
  }

  addElements() {
    if (!this.element || !this.element.id) return;
    
    if (!Array.isArray(this.item.complements)) {
      this.item.complements = [];
    }

    if (this.optElements === 'pill') {
      this.item.complements.push({
        pill_id: this.element.id,
        cat_pill: this.element,
        count: this.element.count || 1,
      });
    } else if (this.optElements === 'products') {
      this.item.complements.push({
        product_id: this.element.id,
        cat_product: this.element,
        count: this.element.count || 1,
      });
    }

    this.element = new _Type();
  }

  deleteElements(index: number) {
    Swal.fire({
      title: 'Quitar elemento',
      text: '¿Seguro que deseas remover este elemento del paquete?',
      icon: 'question',
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, quitar',
      confirmButtonColor: '#84A59D'
    }).then((result) => {
      if (result.isConfirmed) {
        this.item.complements?.splice(index, 1);
        this.cdr.detectChanges();
      }
    });
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TypeService } from '../../services';
import { _Type, Paginate } from '../../models';

import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-cat-references',
  standalone: true,
  imports: [FormsModule, PaginationModule],
  templateUrl: './cat_references.component.html'
})
export class CatReferencesComponent implements OnInit {
  public nameCalog = 'cat_references';
  public catalog: _Type[] = [];
  public item: _Type = new _Type();
  public isEdit = false;
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
      next: (r) => {
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
      next: (r) => {
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
    this.item = new _Type();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  updateItem(_item: _Type) {
    this.isEdit = true;
    this.loading = true;
    this.tS.getById(this.nameCalog, _item.id!).subscribe({
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
      this.tS.put(this.nameCalog, this.item).subscribe(() => {
        this.closeModal();
        this.getCatlog();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Referencia actualizada',
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
          title: 'Referencia creada',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  deleteItem(_item: _Type) {
    Swal.fire({
      title: '¿Eliminar referencia?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará <strong>${_item.name}</strong>. Esta acción no se puede deshacer.</p>`,
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
            title: 'Referencia eliminada',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
    });
  }
}

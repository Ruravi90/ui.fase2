import { Component, OnInit } from '@angular/core';
import { TypeService } from '../../services';
import { _Type, CatPackage, ComplementPackage, Paginate } from '../../models';

import swal from 'sweetalert2';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

declare var $: any, iziToast: any;


import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-cat-package',
    imports: [FormsModule, PaginationModule, NgSelectModule],
    templateUrl: 'cat_package.component.html'
})
export class CatPackageComponent implements OnInit {
  public nameCalog = 'cat_packages';
  public catalog: CatPackage[] = [];
  public elements: _Type[] = [];
  public element!: _Type;
  public item: CatPackage = new CatPackage();
  public isEdit = false;
  public optElements = 'na';
  public filterChanged: Subject<string> = new Subject<string>();
  public paginate: Paginate =  new Paginate();
  public filters: any = {
    perPage: 15,
    name: ''
  };

  constructor(private tS: TypeService) {
    this.filterChanged
    .pipe(
      debounceTime(500)
    )
    .subscribe(() => {
      this.getCatlog();
    });
  }

  ngOnInit(): void {
    this.getCatlog();
    const that = this;
    $('#modal').on('hidden.bs.modal', function (event: any) {
      that.getCatlog();
    });
  }

  getCatlog() {
    this.tS.paginate(this.nameCalog,this.filters).subscribe((r: any) => {
      this.paginate = r;
      this.catalog = r.data;
    });
  }

  pageChanged(event: any){
    this.tS.getForUrl(this.nameCalog,event.page, this.filters).subscribe((r: any) => {
      this.paginate = r;
      this.catalog = r.data;
    });
  }

  filterName(event: any){
    this.filterChanged.next(event);
  }

  addItem() {
    this.isEdit = false;
    this.item = new CatPackage();
    $('#modal').modal('show');
  }

  updateItem(_item: _Type) {
    this.isEdit = true;
    this.tS.getById(this.nameCalog, _item.id!).subscribe((r: any) => {
      this.item = r;
      $('#modal').modal('show');
    });
  }

  save() {
    if (this.isEdit) {
      this.tS.put(this.nameCalog, this.item).subscribe((r: any) => {
        this.item = r;
        $('#modal').modal('hide');
        iziToast.show({
          message: 'Registro actualizado'
        });
      });
    } else {
      this.tS.post(this.nameCalog, this.item).subscribe((r: any) => {
        this.item = r;
        $('#modal').modal('hide');
        iziToast.show({
          message: 'Registro creado'
        });
      });
    }
  }

  async deleteItem(_item: _Type) {
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de continuar',
      icon: 'question',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result: any) => {
      if (result.value) {
        this.tS.delete(this.nameCalog, _item.id!).subscribe((r: any) => {
          this.getCatlog();
          iziToast.show({
            message: 'Registro eliminado'
          });
        });
      }
    });
  }

  changeOptions() {
    this.element = new _Type();
    this.getElements();
  }

  getElements () {
    let _name = '';
    if (this.optElements === 'pill') {
      _name += 'cat_pills';
    } else if (this.optElements === 'products') {
      _name += 'cat_products';
    } else {
        return;
    }

    this.tS.getAll(_name).subscribe((r: any) => {
      this.elements = r;
    });
  }

  addElements() {
    if (!Array.isArray(this.item.complements)) {
      this.item.complements = [];
    }

    if (this.optElements === 'pill') {
      this.item.complements.push({
        pill_id: this.element.id,
        cat_pill: this.element,
        count: this.element.count,
      });
    } else if (this.optElements === 'products') {
      this.item.complements.push({
        product_id: this.element.id,
        cat_product: this.element,
        count: this.element.count,
      });
    } else {
      return;
    }

    this.element = new _Type();
  }

  async deleteElements(index: number) {
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de continuar',
      icon: 'question',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result: any) => {
      if (result.value) {
        this.item.complements?.splice(index, 1);
      }
    });
  }
}

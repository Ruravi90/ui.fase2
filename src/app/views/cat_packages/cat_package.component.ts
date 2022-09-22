import { Component, OnInit } from '@angular/core';
import { TypeService } from '../../services';
import { _Type, CatPackage, ComplementPackage, Paginate } from '../../models';

import swal from 'sweetalert2';
import { Observable, Subject } from 'rxjs';
declare var $: any, iziToast: any;

@Component({
  templateUrl: 'cat_package.component.html'
})
export class CatPackageComponent implements OnInit {
  public nameCalog = 'cat_packages';
  public catalog: CatPackage[]=[];
  public elements: _Type[] = [];
  private timeout?: number;
  public element: _Type = new _Type();
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
  }

  ngOnInit(): void {
    // generate random values for mainChart
    this.getCatlog();
    // tslint:disable-next-line:prefer-const
    let that = this;
    $('#modal').on('hidden.bs.modal', function () {
      that.getCatlog();
    });
  }

  getCatlog() {
    this.tS.paginate(this.nameCalog,this.filters).subscribe(r => {
      this.paginate = r;
      this.catalog = r.data;
    });
  }

  pageChanged(event: any){
    this.tS.getForUrl(this.nameCalog,event.page, this.filters).subscribe(r => {
      this.paginate = r;
      this.catalog = r.data;
    });
  }

  filterName(event: any){
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => this.getCatlog() , 300);
  }

  addItem() {
    this.isEdit = false;
    this.item = new CatPackage();
    $('#modal').modal('show');
  }

  updateItem(_item: _Type) {
    this.isEdit = true;
    this.tS.getById(this.nameCalog, _item.id!).subscribe(r => {
      this.item = r;
      $('#modal').modal('show');
    });
  }

  save() {
    if (this.isEdit) {
      this.tS.put(this.nameCalog, this.item).subscribe(r => {
        this.item = r;
        $('#modal').modal('hide');
        iziToast.show({
          message: 'Registro actualizado'
        });
      });
    } else {
      this.tS.post(this.nameCalog, this.item).subscribe(r => {
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
    }).then((result) => {
      if (result.value) {
        this.tS.delete(this.nameCalog, _item.id!).subscribe(r => {
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

    this.tS.getAll(_name).subscribe(r => {
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

  async deleteElements(index : number) {
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
      if (result.value) {
        this.item.complements!.splice(index, 1);
      }
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { TypeService } from '../../services';
import { _Type, CatPackage, ComplementPackage, Paginate } from '../../models';

import swal from 'sweetalert2';
import { Observable, Subject } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
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
  @ViewChild('modalCatPackages', { static: false }) modalCatPackages?: ModalDirective;

  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });


  constructor(private tS: TypeService) {
  }

  ngOnInit(): void {
    this.getCatlog();
    this.modalCatPackages?.onHidden.subscribe(()=>{
      this.getCatlog();
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
    this.modalCatPackages?.show();
  }

  updateItem(_item: _Type) {
    this.isEdit = true;
    this.tS.getById(this.nameCalog, _item.id!).subscribe(r => {
      this.item = r;
      this.modalCatPackages?.show();
    });
  }

  save() {
    if (this.isEdit) {
      this.tS.put(this.nameCalog, this.item).subscribe(r => {
        this.item = r;
        this.modalCatPackages?.hide();
        this.toast.fire({
          icon:'success',
          title: 'Registro actualizado'
        });
      });
    } else {
      this.tS.post(this.nameCalog, this.item).subscribe(r => {
        this.item = r;
        this.modalCatPackages?.hide();
        this.toast.fire({
          icon:'success',
          title: 'Registro creado'
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
      if (result.isConfirmed) {
        this.tS.delete(this.nameCalog, _item.id!).subscribe(r => {
          this.getCatlog();
          this.toast.fire({
            icon:'success',
            title: 'Registro eliminado'
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
      if (result.isConfirmed) {
        this.item.complements!.splice(index, 1);
      }
    });
  }

}

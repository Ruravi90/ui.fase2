import { Component, OnInit, ViewChild } from '@angular/core';
import { TypeService } from '../../services';
import { _Type, Paginate } from '../../models';

import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var $: any, iziToast: any;

@Component({
  templateUrl: './cat_services.component.html'
})
export class CatServicesComponent implements OnInit {
  public nameCalog = 'cat_services';
  public catalog: _Type[] = [];
  public item: _Type = new _Type();
  private timeout?: number;
  public isEdit = false;
  public filterChanged: Subject<string> = new Subject<string>();
  public paginate: Paginate =  new Paginate();
  public filters: any = {
    perPage: 15,
    name: ''
  };
  @ViewChild('modalCatService', { static: false }) modalCatService?: ModalDirective;

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
    let that = this;
    this.modalCatService?.onHidden.subscribe(()=>{
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
    this.item = new _Type();
    this.modalCatService?.show();
  }

  updateItem(_item: _Type) {
    this.isEdit = true;
    this.tS.getById(this.nameCalog, _item.id!).subscribe(r => {
      this.item = r;
      this.modalCatService?.show();
    });
  }

  save() {
    if (this.isEdit) {
      this.tS.put(this.nameCalog, this.item).subscribe(r => {
        this.modalCatService?.hide();
        this.toast.fire({
          icon:'success',
          title: 'Registro actualizado'
        });
      });
    } else {
      this.tS.post(this.nameCalog, this.item).subscribe(r => {
        this.modalCatService?.hide();
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
}

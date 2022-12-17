import { Component, OnInit, ViewChild } from '@angular/core';
import { TypeService } from '../../services';
import { _Type, Paginate } from '../../models';

import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var $: any, iziToast: any;

@Component({
  templateUrl: './cat_concepts.component.html'
})
export class CatConceptsComponent implements OnInit {
  public nameCalog = 'cat_concepts';
  public catalog: _Type[] | undefined;
  private timeout?: number;
  public item: _Type = new _Type();
  public isEdit = false;
  public paginate: Paginate =  new Paginate();
  public filters: any = {
    perPage: 15,
    name: ''
  };
  @ViewChild('modalCatConcepts', { static: false }) modalCatConcepts?: ModalDirective;

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
    // generate random values for mainChart
    this.getCatlog();
    this.modalCatConcepts?.onHidden.subscribe(()=>{
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
    this.timeout = window.setTimeout(() => this.getCatlog(), 300);
  }

  addItem() {
    this.isEdit = false;
    this.item = new _Type();
    this.modalCatConcepts?.show();
  }

  updateItem(_item: _Type) {
    this.isEdit = true;
    this.tS.getById(this.nameCalog, _item.id!).subscribe(r => {
      this.item = r;
      this.modalCatConcepts?.show();
    });
  }

  save() {
    if (this.isEdit) {
      this.tS.put(this.nameCalog, this.item).subscribe(r => {
        this.item = r;
        this.modalCatConcepts?.hide();
        this.toast.fire({
          icon:'success',
          title: 'Registro actualizado'
        });
      });
    } else {
      this.tS.post(this.nameCalog, this.item).subscribe(r => {
        this.item = r;
        this.modalCatConcepts?.hide();
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
      if (result.value) {
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

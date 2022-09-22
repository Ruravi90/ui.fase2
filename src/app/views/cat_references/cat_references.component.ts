import { Component, OnInit } from '@angular/core';
import { TypeService } from '../../services';
import { _Type, Paginate } from '../../models';

import swal from 'sweetalert2';
import { Subject } from 'rxjs';
declare var $: any, iziToast: any;


@Component({
  templateUrl: './cat_references.component.html'
})
export class CatReferencesComponent implements OnInit {
  public nameCalog = 'cat_references';
  public catalog: _Type[] = [];
  private timeout?: number;
  public item: _Type = new _Type();
  public isEdit = false;
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
    this.item = new _Type();
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
        iziToast.show({
          message: 'Registro actualizado'
        });
      });
    } else {
      this.tS.post(this.nameCalog, this.item).subscribe(r => {
        this.item = r;
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
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      }
      // else if (result.dismiss === swal.DismissReason.cancel) {
      //  swal.fire(
      //    'Cancelled',
      //    'Your imaginary file is safe :)',
      //    'error'
      //  );
      //}
    });
  }
}

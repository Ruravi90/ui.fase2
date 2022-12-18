import { Component, OnInit, ViewChild } from '@angular/core';
import { TypeService } from '../../services';
import { _Type,Paginate } from '../../models';

import swal from 'sweetalert2';
import izitoast from 'izitoast';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: './cat_expenses.component.html',
})
export class CatExpensesComponent implements OnInit {
  public nameCalog = 'cat_expenses';
  public catalog: _Type[] =[];
  private timeout?: number;
  public item: _Type = new _Type();
  public isEdit = false;
  public paginate: Paginate =  new Paginate();
  public filters: any = {
    perPage: 15,
    name: ''
  };
  @ViewChild('modalCatExpenses', { static: false }) modalCatExpenses?: ModalDirective;

  constructor(private tS: TypeService) {
  }

  ngOnInit(): void {
    this.getCatlog();
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
    this.modalCatExpenses?.show();
  }

  updateItem(_item: _Type) {
    this.isEdit = true;
    this.tS.getById(this.nameCalog, _item.id!).subscribe(r => {
      this.item = r;
      this.modalCatExpenses?.show();
    });
  }

  save() {
    if (this.isEdit) {
      this.tS.put(this.nameCalog, this.item).subscribe(r => {
        this.item = r;
        this.modalCatExpenses?.hide();
        izitoast.success({
          title: 'Registro actualizado'
        });
      });
    } else {
      this.tS.post(this.nameCalog, this.item).subscribe(r => {
        this.item = r;
        this.modalCatExpenses?.hide();
        izitoast.success({
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
          izitoast.success({
            title: 'Registro eliminado'
          });
        });
      }
    });
  }
}

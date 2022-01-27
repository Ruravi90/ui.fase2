import { Component, OnInit } from '@angular/core';
import { ProductsInventaryService, TypeService } from '../../services';
import { ProductsInventory, _Type } from '../../models';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
declare var $: any, iziToast: any;

@Component({
  templateUrl: 'products_inventory.component.html'
})
export class ProductsInventoryComponent implements OnInit {
  public inventory: ProductsInventory[];
  public cmbProducts$: Observable<_Type[]>;
  public item: ProductsInventory = new ProductsInventory();
  public isEdit = false;
  constructor(private pS: ProductsInventaryService, private tS: TypeService) {
  }

  ngOnInit(): void {
    // generate random values for mainChart
    this.getCatlog();
    // tslint:disable-next-line:prefer-const
    let that = this;
    $('#modal').on('hidden.bs.modal', function (event) {
      that.getCatlog();
    });
  }

  getCatlog() {
    this.pS.getAll().subscribe(r => {
      this.inventory = r;
    });
  }

  add() {
    this.isEdit = false;
    this.item = new ProductsInventory();
    this.cmbProducts$ = this.tS.getAll('cat_products');
    $('#modal').modal('show');
  }

  update(_item: ProductsInventory) {
    this.isEdit = true;
    this.cmbProducts$ = this.tS.getAll('cat_products');
    this.pS.getById(_item.id).subscribe(r => {
      this.item = r;
      $('#modal').modal('show');
    });
  }

  save() {
    this.item.product_id = this.item.product.id;
    if (this.isEdit) {
      this.pS.put(this.item).subscribe(r => {
        this.item = r;
        $('#modal').modal('hide');
        iziToast.show({
          message: 'Registro actualizado'
        });
      });
    } else {
      this.pS.post(this.item).subscribe(r => {
        this.item = r;
        $('#modal').modal('hide');
        iziToast.show({
          message: 'Registro creado'
        });
      });
    }
  }

  async delete(_item: _Type) {
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
        this.pS.delete(_item.id).subscribe(r => {
          this.getCatlog();
          iziToast.show({
            message: 'Registro eliminado'
          });
        });
      }
    });
  }
}

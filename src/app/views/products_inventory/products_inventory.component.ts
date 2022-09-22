import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsInventaryService, TypeService } from '../../services';
import { ProductsInventory, _Type } from '../../models';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
declare var $: any, iziToast: any;

@Component({
  templateUrl: 'products_inventory.component.html',
})
export class ProductsInventoryComponent implements OnInit {
  public inventory: ProductsInventory[] = [];
  public cmbProducts$: Observable<_Type[]> =new Observable<_Type[]>();
  public formProduct: FormGroup = new FormGroup({
    product: new FormControl(''),
    count: new FormControl(''),
  });
  public product: ProductsInventory = new ProductsInventory();
  public isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private pS: ProductsInventaryService,
    private tS: TypeService) {
  }

  ngOnInit(): void {

    this.formProduct = this.formBuilder.group(
      {
        product: ['', Validators.required],
        count: ['',Validators.required],
      }
    );


    // generate random values for mainChart
    this.getCatlog();
    // tslint:disable-next-line:prefer-const
    let that = this;
    $('#modal').on('hidden.bs.modal', function () {
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
    this.formProduct =new FormGroup({
      product: new FormControl('', Validators.required),
      count: new FormControl('', Validators.required),
    });
    this.cmbProducts$ = this.tS.getAll('cat_products');
    $('#modal').modal('show');
  }

  update(_item: ProductsInventory) {
    this.isEdit = true;
    this.cmbProducts$ = this.tS.getAll('cat_products');
    this.pS.getById(_item.id!).subscribe(r => {
      this.product = _item;
      this.formProduct =new FormGroup({
        product: new FormControl(_item.product, Validators.required),
        count: new FormControl(_item.count, Validators.required),
      });
      $('#modal').modal('show');
    });
  }

  save() {
    //this.item.product_id = this.item.product.id;
    this.product.product = this.formProduct.value.product;
    this.product.count = this.formProduct.value.count;

    if (this.isEdit) {
      this.pS.put(this.product).subscribe(r => {
        $('#modal').modal('hide');
        iziToast.show({
          message: 'Registro actualizado'
        });
      });
    } else {
      this.pS.post(this.product).subscribe(r => {
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
        this.pS.delete(_item.id!).subscribe(r => {
          this.getCatlog();
          iziToast.show({
            message: 'Registro eliminado'
          });
        });
      }
    });
  }
}

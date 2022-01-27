import { Component, OnInit } from '@angular/core';
import { PillsInventoryService, TypeService } from '../../services';
import { PillsInventory, _Type } from '../../models';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
declare var $: any, iziToast: any;

@Component({
  templateUrl: 'pills_inventory.component.html'
})
export class PillsInventoryComponent implements OnInit {
  public inventory: PillsInventory[];
  public cmbPills$: Observable<_Type[]>;
  public item: PillsInventory = new PillsInventory();
  public isEdit = false;
  constructor(private pS: PillsInventoryService, private tS: TypeService) {
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
      console.log(r);
      this.inventory = r;
    });
  }

  add() {
    this.isEdit = false;
    this.item = new PillsInventory();
    this.cmbPills$ = this.tS.getAll('cat_pills');
    $('#modal').modal('show');
  }

  update(_item: PillsInventory) {
    this.isEdit = true;
    this.cmbPills$ = this.tS.getAll('cat_pills');
    this.pS.getById(_item.id).subscribe(r => {
      this.item = r;
      $('#modal').modal('show');
    });
  }

  save() {
    this.item.pill_id = this.item.pill.id;
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

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PillsInventoryService, TypeService } from '../../services';
import { PillsInventory, _Type } from '../../models';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
declare var $: any, iziToast: any;

@Component({
  templateUrl: 'pills_inventory.component.html',
})
export class PillsInventoryComponent implements OnInit {
  public inventory: PillsInventory[] =[];
  public cmbPills$: Observable<_Type[]> = new Observable<_Type[]>();
  public formPill: FormGroup = new FormGroup({
    pill: new FormControl(''),
    count: new FormControl(''),
  });
  public pill : PillsInventory = new PillsInventory();

  public isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private pS: PillsInventoryService,
    private tS: TypeService) {
  }

  ngOnInit(): void {
    this.formPill = this.formBuilder.group(
      {
        pill: ['', Validators.required],
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
      console.log(r);
      this.inventory = r;
    });
  }

  add() {
    this.isEdit = false;
    this.formPill =new FormGroup({
      pill: new FormControl(''),
      count: new FormControl(''),
    });
    this.cmbPills$ = this.tS.getAll('cat_pills');
    $('#modal').modal('show');
  }

  update(_item: PillsInventory) {
    this.isEdit = true;
    this.cmbPills$ = this.tS.getAll('cat_pills');
    this.pS.getById(_item.id!).subscribe(r => {
      this.pill = _item;
      this.formPill =new FormGroup({
        pill: new FormControl(_item.pill),
        count: new FormControl(_item.count),
      });
      $('#modal').modal('show');
    });
  }

  save() {

    this.pill.pill = this.formPill.value.pill;
    this.pill.count = this.formPill.value.count;

    if (this.isEdit) {
      this.pS.put(this.pill).subscribe(r => {
        $('#modal').modal('hide');
        iziToast.show({
          message: 'Registro actualizado'
        });
      });
    } else {
      this.pS.post(this.pill).subscribe(r => {
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

import { Component, OnInit } from '@angular/core';
import { CreditorService } from '../../services';
import { Creditor} from '../../models';

import swal from 'sweetalert2';
import { Subject, Observable } from 'rxjs';
declare var $: any, iziToast: any;

@Component({
  templateUrl: 'creditors.component.html'
})

export class CreditorsComponent implements OnInit {
  public creditors$: Observable<Creditor[]> = new Observable<Creditor[]>();
  public model: Creditor = new Creditor();
  public isEdit: Boolean = false;

  constructor(
    private cS: CreditorService) {
  }

  ngOnInit(): void {
    this.getCreditors();
    const that = this;
    $('#modal').on('hidden.bs.modal', function () {
      that.getCreditors();
    });
  }

  getCreditors() {
    this.creditors$ = this.cS.get();
  }

  save() {
    if (this.isEdit) {
      this.cS.put(this.model).subscribe(r => {
        this.getCreditors();
        $('#modal').modal('hide');
        iziToast.show({
            title: 'Registro actualizado'
        });
       }, e =>{
        iziToast.show({
          title: 'No fue posible actualizar el registro',
          color: 'red'
      });
       });
    } else {
      this.cS.post(this.model).subscribe(r => {
        this.getCreditors();
        $('#modal').modal('hide');
        iziToast.show({
            title: 'Registro creado'
        });
       },e =>{
        iziToast.show({
          title: 'No fue posible crear el registro',
          color: 'red'
        });
       });
    }
  }

  add(): void {
    this.isEdit = false;
    this.model = new Creditor();
    $('#modal').modal('show');
  }

  edit(c: Creditor): void {
    this.isEdit = true;
    setTimeout(() => {
      this.cS.getById(c.id!).subscribe(r => {
        this.model = r;
        $('#modal').modal('show');
      });
    }, 300);
  }

  async delete(c: Creditor) {
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
        this.cS.delete(c.id!).subscribe(r => {
          this.getCreditors();
          iziToast.show({
            title: 'Registro eliminado'
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

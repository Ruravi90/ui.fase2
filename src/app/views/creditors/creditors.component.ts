import { Component, OnInit, ViewChild } from '@angular/core';
import { CreditorService } from '../../services';
import { Creditor} from '../../models';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import izitoast from 'izitoast';

@Component({
  templateUrl: 'creditors.component.html'
})

export class CreditorsComponent implements OnInit {
  public creditors$: Observable<Creditor[]> = new Observable<Creditor[]>();
  public model: Creditor = new Creditor();
  public isEdit: Boolean = false;
  @ViewChild('modalCreditor', { static: false }) modalCreditor?: ModalDirective;

  constructor(
    private cS: CreditorService) {
  }

  ngOnInit(): void {
    this.getCreditors();
  }

  getCreditors() {
    this.creditors$ = this.cS.get();
  }

  save() {
    if (this.isEdit) {
      this.cS.put(this.model).subscribe(r => {
        this.getCreditors();
        this.modalCreditor?.hide();
        izitoast.success({
          title: 'Registro actualizado'
        });
       }, e =>{
        izitoast.success({
          title: 'No fue posible actualizar el registro'
        });
       });
    } else {
      this.cS.post(this.model).subscribe(r => {
        this.getCreditors();
        this.modalCreditor?.hide();
        izitoast.success({
          title: 'Registro creado'
        });
       },e =>{
        izitoast.error({
          title: 'No fue posible crear el registro',
        });
       });
    }
  }

  add(): void {
    this.isEdit = false;
    this.model = new Creditor();
    this.modalCreditor?.show();
  }

  edit(c: Creditor): void {
    this.isEdit = true;
    setTimeout(() => {
      this.cS.getById(c.id!).subscribe(r => {
        this.model = r;
        this.modalCreditor?.show();
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
      if (result.isConfirmed) {
        this.cS.delete(c.id!).subscribe(r => {
          this.getCreditors();
          izitoast.success({
            title: 'Registro eliminado'
          });
        });
      }
    });
  }
}

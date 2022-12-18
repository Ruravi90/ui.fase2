import { Component, OnInit } from '@angular/core';
import { PurchaseService, TypeService } from '../../services';
import { Purchase, _Type, Paginate } from '../../models';

import swal from 'sweetalert2';
import izitoast from 'izitoast';

@Component({
  templateUrl: 'to_pay.component.html'
})
export class ToPayComponent implements OnInit {
  public purchases: Purchase[] = [];
  public paginate: Paginate = new Paginate();
  public filters: any = { isPaid: 0, perPage:15 };

  constructor(private pS: PurchaseService, private tS: TypeService) {
  }

  ngOnInit(): void {
    this.getCatlog();
  }

  getCatlog() {
    this.pS.paginate(this.filters).subscribe(r => {
      this.paginate = r;
      this.purchases = r.data;
    });
  }

  pageChanged(event: any){
    this.pS.getForUrl(event.page, this.filters).subscribe(r => {
      this.paginate = r;
      this.purchases = r.data;
    });
  }

  async pay(item: Purchase) {
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de continuar',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, pagar!'
    }).then((result) => {
      this.pS.pay(item).subscribe(r => {
        this.getCatlog();
        izitoast.success({
          message: 'Compra marcada como pagada'
        });
      });
    });
  }

}

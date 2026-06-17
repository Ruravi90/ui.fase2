import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginateService, SaleService, PaymentService, AgentService, TypeService } from '../../services';
import { Department, User, Sale, _Type, Paginate, Payment } from '../../models';
import { environment } from '../../../environments/environment';
import { NgSelectModule } from '@ng-select/ng-select';

import swal from 'sweetalert2';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
declare var $: any, iziToast: any;

@Component({
    selector: 'app-sales',
    imports: [CommonModule, FormsModule, PaginationModule, DatePipe, NgSelectModule],
    templateUrl: 'sales.component.html',
    styleUrls: ['./sales.component.css']
})

export class SalesComponent implements OnInit {
  public env = environment;
  public currentUser: User = new User();
  public sales: Sale[] | any = []; 
  public sale:  Sale = new Sale();
  public payment:  Payment = new Payment();
  public payments: Payment[] = [];
  public printPayment?: Payment | null;
  public cuteSales: Department[] | null = [];
  public printSale?: Sale | null;
  public dateNow: Date = new Date();
  public paginate: Paginate = new Paginate();
  public isBusy: boolean = false;

  public isCopyPrint = false;
  public filters: any = {
    perPage: 15,
    isPaid: 0
  };

  public typeSale$!: Observable<_Type[]>;
  public agents$!: Observable<User[]>;

  public subTotal = 0;
  public balance = 0;

  private amountChange: Subject<string> = new Subject();

  constructor(
    private sS: SaleService,
    private aS: AgentService,
    private paS: PaymentService,
    private tS: TypeService,
    private pS: PaginateService
  ) {
    this.pS.model = 'sales';

    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  }

  ngOnInit(): void {
    this.getSales();
    this.agents$ = this.aS.get();
    this.typeSale$ = this.tS.getAll('cat_type_sales');
    this.amountChange.pipe(debounceTime(300)).subscribe(() => {
      if ((this.payment.amount || 0) > this.balance) {
        this.payment.amount = this.balance;
      }
    });
    const that = this;
    $('#modalPayment').on('hidden.bs.modal', function (event: any) {
      that.getSales();
    });
  }

  getRoles(p: string) {
    if (!this.currentUser) return false;
    return this.currentUser.roles?.some(r => r.slug === p) ?? false;
  }

  getSales() {
    this.pS.paginate(this.filters).subscribe(res => {
     this.paginate = res;
     this.sales = res.data;
    });
  }

  pageChanged(event: any){
    this.pS.getForUrl(event.page, this.filters).subscribe(res => {
      this.paginate = res;
      this.sales = res.data;
    });
  }


  async delete(s: Sale){
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de cancelar la venta',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Cancelar!'
    }).then((result: any) => {
      this.sS.cancel(s.id!).subscribe((r: any)=>{
        const index = this.sales.findIndex((r: any) => r.id === s.id);
        if (index > -1) {
          this.sales.splice(index, 1);
        }
        iziToast.show({
          message: 'Registro cancelado correctamente'
        });
      });
    });
  }

  onChangeAmount() {
    this.amountChange.next('');
  }

  addPayment(s: Sale) {
    this.sale =  s;
    this.payment = new Payment();
    this.payment.is_paid = s.is_paid;
    this.payment.sale_id = s.id;
    this.onCalculateTotal();
    this.getPayments();
    $('#modalPayment').modal('show');
  }

  onCalculateTotal() {
    this.sale.price = Number(this.sale.price);
    this.sale.subtotal =  this.sale.price;
    let discount = 0;
    if (typeof this.sale.discount !== 'undefined') {
      discount = ((Number(this.sale.discount) * this.sale.subtotal) / 100);
    }

    this.sale.subtotal = this.sale.subtotal - Number(discount);
    this.sale.total = this.sale.subtotal;
  }

  getPayments() {
    this.paS.geForSales(this.payment.sale_id!).subscribe((r: any) => {
      this.payments = r.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      this.subTotal = 0;
      r.forEach((e: any) => {
        this.subTotal = this.subTotal + Number(e.amount);
      });
      this.balance = (this.sale.subtotal! - this.subTotal);
      this.sale.is_paid = this.balance <= 0;
      $('#modalPayment').modal('show');
    });
  }

  savePayment() {
    this.printSale = null;
    this.payment.user_id = this.currentUser.id;
    this.paS.post(this.payment).subscribe(r => {
      this.printTicket(r.id);
      $('#modalPayment').modal('hide');
      iziToast.show({
        message: 'Registro creado'
      });
    });
  }

  async printCute(date: any){
    this.printPayment = null;
    this.printSale = null;
    this.sS.getCuteDay(date).subscribe(r => {
      this.cuteSales = r;
      this.cuteSales!.forEach((d: any) => {
        d.sumCardTotal = 0;
        d.sumCashTotal = 0;
        d.sales.forEach((s: any) => {
          s.sumCashTotal = 0;
          s.sumCardTotal = 0;
          s.sales.forEach((ss: any) => {
            ss.payments.forEach((p: any) => {
              if (p.type.id === 1){
                s.sumCashTotal = (s.sumCashTotal || 0) + Number(p.amount);
              } else {
                s.sumCardTotal = (s.sumCardTotal || 0) + Number(p.amount);
              }
            });
          });
          d.sumCardTotal = (d.sumCardTotal || 0) + (s.sumCardTotal || 0);
          d.sumCashTotal = (d.sumCashTotal || 0) + (s.sumCashTotal || 0);
        });
      });


      setTimeout(() => {
        setTimeout(() => {
          this.printToCart('printTicket');
        }, 500);
      }, 500);
    });
  }

  printToCart(printSectionId: string) {
    const printContents = document.getElementById(printSectionId)?.innerHTML;
    if (!printContents) return;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Imprimiendo Ticket...</title>
            <link rel="stylesheet" type="text/css" href="assets/css/print.css">
          </head>
          <body onload="setTimeout(function() { window.print(); window.parent.document.body.removeChild(window.frameElement); }, 500);">
            ${printContents}
          </body>
        </html>
      `);
      doc.close();
    }

    if (this.isCopyPrint) {
      this.isCopyPrint = false;
      setTimeout(() => this.printToCart(printSectionId), 1000);
    }
  }


  async printTicket(id: number) {
    this.printSale = null;
    this.cuteSales = null;
    this.paS.getById(id!).subscribe((r: any) => {
      this.printPayment = r;
      setTimeout(() => {
        setTimeout(() => {
          this.printToCart('printTicket');
          this.isCopyPrint = true;
        }, 500);
      }, 500);
    });
  }

  copyTicket(s: Sale) {
    this.printPayment = null;
    this.cuteSales = null;
    this.sS.getById(s.id!).subscribe((r: any) => {
      this.printSale = r;
      this.printSale!.sumTotal = 0;
      this.printSale!.sales.forEach((e: any, i: any) => {
        this.printSale!.sumTotal =  this.printSale!.sumTotal! + Number(e.amount);
      });
      setTimeout(() => {
        setTimeout(() => {
          this.printToCart('printTicket');
        }, 500);
      }, 500);
    });
  }
}

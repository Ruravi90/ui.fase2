import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { PaginateService, SaleService, PaymentService, AgentService, TypeService } from '../../services';
import { Department, User, Sale, _Type, Paginate, Payment } from '../../models';
import { environment } from '../../../environments/environment';

import swal from 'sweetalert2';
import { Subject, Observable } from 'rxjs';
declare var $: any, iziToast: any;
import * as print from 'print-js';

@Component({
  templateUrl: 'sales.component.html',
  styleUrls: ['./sales.component.css']
})

export class SalesComponent implements OnInit {
  public env = environment;
  private timeout?: number;
  public currentUser: User = new User();
  public sales: Sale[] | any = [];
  public sale:  Sale = new Sale();
  public payment:  Payment = new Payment();
  public payments: Payment[] = [];
  public printPayment: Payment = new Payment;
  public cuteSales: Department[] = [];
  public printSale: Sale = new Sale;
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
    const that = this;
    $('#modalPayment').on('hidden.bs.modal', function () {
      that.getSales();
    });
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
    }).then((result) => {
      this.sS.cancel(s.id!).subscribe((r)=>{
        const index = this.sales.findIndex((r:any)=> r.id === s.id);
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
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (this.payment.amount! > this.balance) {
        this.payment.amount = this.balance;
      }
    } , 300);
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
    this.paS.geForSales(this.payment.sale_id!).subscribe(r => {
      this.payments = r;
      this.subTotal = 0;
      r.forEach((e) => {
          this.subTotal = this.subTotal + Number(e.amount);
      });
      this.balance = (this.sale.subtotal! - this.subTotal);
      this.sale.is_paid = this.balance <= 0;
      $('#modalPayment').modal('show');
    });
  }

  savePayment() {
    this.printSale = new Sale();
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
    this.printPayment = new Payment();
    this.printSale = new Sale();
    this.sS.getCuteDay(date).subscribe(r => {
      this.cuteSales = r;
      this.cuteSales.forEach((d, i) => {
        this.cuteSales[i].sumCardTotal = 0;
          this.cuteSales[i].sumCashTotal = 0;
          d.sales!.forEach((s, i2) => {
          this.cuteSales[i].sales![i2].sumCashTotal = 0;
          this.cuteSales[i].sales![i2].sumCardTotal = 0;
          s.sales.forEach((ss, i3) => {
            ss.payments.forEach((p, i4) => {
              if (p.type!.id === 1){
                this.cuteSales[i].sales![i2].sumCashTotal = this.cuteSales[i].sales![i2].sumCashTotal! + Number(p.amount);
              } else {
                this.cuteSales[i].sales![i2].sumCardTotal = this.cuteSales[i].sales![i2].sumCardTotal! + Number(p.amount);
              }
            });
          });
          this.cuteSales[i].sumCardTotal = this.cuteSales[i].sumCardTotal! + this.cuteSales[i].sales![i2].sumCardTotal!;
          this.cuteSales[i].sumCashTotal = this.cuteSales[i].sumCashTotal! + this.cuteSales[i].sales![i2].sumCashTotal!;
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
    print({
      printable: printSectionId,
      type: 'html',
      css: 'assets/css/print.css',
      scanStyles: false,
      showModal: true,
      modalMessage: 'Preparando ticket',
      onLoadingEnd: () => {
        if (this.isCopyPrint) {
          this.isCopyPrint = false;
          this.printToCart(printSectionId);
        }
      }
  });
  }


  async printTicket(id: number) {
    this.printSale = new Sale();
    this.cuteSales = [];
    this.paS.getById(id).subscribe(r => {
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
    this.printPayment = new Payment();
    this.cuteSales = [];
    this.sS.getById(s.id!).subscribe(r => {
      this.printSale = r;
      this.printSale.sumTotal = 0;
      this.printSale.sales.forEach((e, i) => {
        this.printSale.sumTotal =  this.printSale.sumTotal! + Number(e.amount);
      });
      setTimeout(() => {
        setTimeout(() => {
          this.printToCart('printTicket');
        }, 500);
      }, 500);
    });
  }
}

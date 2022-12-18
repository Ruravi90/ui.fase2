import { Component, OnInit, ViewChild } from '@angular/core';
import { PackageService, AgentService, PaymentService, PackageTrackingService, TypeService, SaleService,PaginateService } from '../../services';
import { User, Package, PackageTracking, Payment, Sale, _Type, Paginate } from '../../models';
import { Subject, Observable } from 'rxjs';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

import { DatepickerOptions } from 'ng2-datepicker';
import locale from 'date-fns/locale/en-US';
import { ModalDirective } from 'ngx-bootstrap/modal';
import izitoast from 'izitoast';
declare var printJS: any;

@Component({
    selector: 'app-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.css']
})

export class PackagesComponent implements OnInit {
  public env = environment;
  private timeout?: number;
  public currentUser: User = new User();
  public filters: any = { isCompleted: 0, perPage:15 };
  public packages: Package [] = [];
  public package: Package = new Package;
  public agents$: Observable<User[]> =new Observable<User[]>();
  public tracker: PackageTracking = new PackageTracking();
  public trackers: PackageTracking[] = [];
  public sale: Sale = new Sale();
  public typeSale$: Observable<_Type[]> =new Observable<_Type[]>();
  public payment: Payment = new Payment();
  public printPayment: Payment =new Payment() ;
  public payments: Payment [] = [];
  @ViewChild('modalPayment', { static: false }) modalPayment?: ModalDirective;
  @ViewChild('modalTracker', { static: false }) modalTracker?: ModalDirective;
  public subTotal: number = 0;
  public balance: number = 0;

  public paginate: Paginate = new Paginate();

  public disabledTracker = false;

  constructor(
    private pS: PackageService,
    private aS: AgentService,
    private paS: PaymentService,
    private tS: TypeService,
    private ptS: PackageTrackingService,
    private pagS: PaginateService) {
      this.pagS.model = 'packages';
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      this.getPackages();
  }

  ngOnInit() {
    this.agents$ = this.aS.get();
    this.typeSale$ = this.tS.getAll('cat_type_sales');
    this.getPackages();
  }

  getPackages() {
    this.pagS.paginate(this.filters).subscribe(r => {
      this.paginate = r;
      this.packages = r.data;
    });
  }

  pageChanged(event: any){
    this.pagS.getForUrl(event.page, this.filters).subscribe(res => {
      this.paginate = res;
      this.packages = res.data;
    });
  }


  async delete(p: Package){
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
        this.pS.delete(p.id!).subscribe((r) => {
          const index = this.packages.findIndex(p => p.id === p.id);
          if (index > -1) {
            this.packages.splice(index, 1);
          }
          izitoast.success({
            title: 'Registro eliminado'
          });
        });
      }
    });
  }

  addPayment(p: Package) {
    this.payment = new Payment();
    this.payment.sale_id = p.sale_id;
    this.sale = p.sale!;
    this.onCalculateTotal();
    this.getPayments();
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
          this.subTotal = this.subTotal + parseInt(e.amount!.toString(), 10);
      });
      this.balance = (this.sale.subtotal! - this.subTotal);
      this.sale.is_paid = this.balance <= 0;
      this.modalPayment?.show();
    });
  }

  onChangeAmount() {
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (this.payment.amount! > this.balance) {
        this.payment.amount = this.balance;
      }
    }, 300);
  }

  savePayment() {
    this.printPayment = new Payment();
    this.payment.user_id = this.currentUser.id;
    this.paS.post(this.payment).subscribe(r => {
      this.copyTicket(r);
      setTimeout(() => {

        setTimeout(() => {
          this.printTicket();
          setTimeout(() => {
            this.printTicket();
            this.getPackages();
          }, 500);
        }, 1000);

      }, 1000);
      this.modalPayment?.hide();
      izitoast.success({
        title: 'Registro creado'
      });
    });
  }

  copyTicket(p: Payment) {
    this.printPayment = new Payment();
    this.paS.getById(p.id!).subscribe(r => {
      this.printPayment = r;
    });
  }

  printTicket() {
    this.buildingTicket('printTicket');
  }

/**
 *
 *
 * @param {string} id
 * @memberof SalesComponent
 */
  buildingTicket(id: string) {
    printJS({
      printable: id,
      type: 'html',
      css: ['assets/css/print.css']
    });
  }


  addTracker(p: Package) {
    this.disabledTracker = (p.type!.session_count! <= p.tracking!.length);
    this.tracker = new PackageTracking();
    this.package = p;
    this.tracker.is_taken = true;
    this.tracker.package_id = p.id;
    this.tracker.scheduled_date = '';
    this.getTracking();
    this.modalTracker?.show();
  }

  getTracking() {
    this.ptS.geForPackage(this.tracker.package_id!).subscribe(r => {
      this.trackers = r;
    });
  }

  saveTracking() {
    this.tracker.scheduled_date = moment(this.tracker.scheduled_date).format('Y-MM-D h:mm:ss');
    this.ptS.post(this.tracker).subscribe(xhr => {
      this.modalTracker?.hide();
      izitoast.success({
        title: 'Registro creado'
      });
    });
  }

  getDateFinish(p: Package): Date {
    const date = new Date(p.created_at!);
    date.setDate(date.getDate() + 84);
    return date;
 }
}

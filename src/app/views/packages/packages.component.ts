import { Component, OnInit } from '@angular/core';
import { PackageService, AgentService, PaymentService, PackageTrackingService, TypeService, SaleService,PaginateService } from '../../services';
import { User, Package, PackageTracking, Payment, Sale, _Type, Paginate } from '../../models';
import { Subject, Observable } from 'rxjs';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

import { DatepickerOptions } from 'ng2-datepicker';
import locale from 'date-fns/locale/en-US';

declare var $: any, iziToast: any, printJS: any;

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
  // tslint:disable-next-line:no-inferrable-types
  public subTotal: number = 0;
  public balance: number = 0;

  public paginate: Paginate = new Paginate();

  public disabledTracker = false;
  private amountChange: Subject<string> = new Subject();

  public options: DatepickerOptions = {
    minYear: 1970, // minimum available and selectable year
    maxYear: Date.now(), // maximum available and selectable year
    placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'LLLL do yyyy', // date format to display in input
    formatTitle: 'LLLL yyyy',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: locale, // date-fns locale
    position: 'bottom',
    inputClass: '', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
  };


  constructor(
    private pS: PackageService,
    private aS: AgentService,
    private paS: PaymentService,
    private tS: TypeService,
    private ptS: PackageTrackingService,
    private pagS: PaginateService,
    private sS: SaleService) {
      this.pagS.model = 'packages';
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      this.getPackages();
  }

  ngOnInit() {
    this.agents$ = this.aS.get();
    this.typeSale$ = this.tS.getAll('cat_type_sales');
    const that = this;

    $('#modalTracker').on('hidden.bs.modal', function () {
      that.getPackages();
    });

    $('#modalPayment').on('hidden.bs.modal', function () {
      that.getPackages();
    });
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
      if (result.value) {
        this.pS.delete(p.id!).subscribe((r) => {
          const index = this.packages.findIndex(p => p.id === p.id);
          if (index > -1) {
            this.packages.splice(index, 1);
          }
          iziToast.show({
            message: 'Registro eliminado'
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
      $('#modalPayment').modal('show');
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
      $('#modalPayment').modal('hide');
      iziToast.show({
        message: 'Registro creado'
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
    // tslint:disable-next-line:prefer-const
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
    $('#modalTracker').modal('show');
  }

  getTracking() {
    this.ptS.geForPackage(this.tracker.package_id!).subscribe(r => {
      this.trackers = r;
    });
  }

  saveTracking() {
    this.tracker.scheduled_date = moment(this.tracker.scheduled_date).format('Y-MM-D h:mm:ss');
    this.ptS.post(this.tracker).subscribe(xhr => {
      $('#modalTracker').modal('hide');
      iziToast.show({
        message: 'Registro creado'
      });
    });
  }

  getDateFinish(p: Package): Date {
    const date = new Date(p.created_at!);
    date.setDate(date.getDate() + 84);
    return date;
 }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PackageService, AgentService, PaymentService, PackageTrackingService, TypeService, SaleService,PaginateService } from '../../services';
import { User, Package, PackageTracking, Payment, Sale, _Type, Paginate } from '../../models';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import swal from 'sweetalert2';
import { format } from 'date-fns';
import { environment } from '../../../environments/environment';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';

declare var iziToast: any, printJS: any;

@Component({
    selector: 'app-packages',
    imports: [CommonModule, FormsModule, NgSelectModule, PaginationModule],
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.scss']
})

export class PackagesComponent implements OnInit {
  public env = environment;
  public currentUser: User = new User();
  public filters: any = { isCompleted: 0, perPage:15 };
  public packages: Package [] = [];
  public package: Package = new Package();
  public agents$!: Observable<User[]>;
  public tracker: PackageTracking = new PackageTracking();
  public trackers: PackageTracking[] = [];
  public sale: Sale = new Sale();
  public typeSale$!: Observable<_Type[]>;
  public payment: Payment = new Payment();
  public printPayment?: Payment;
  public payments: Payment [] = [];
  // tslint:disable-next-line:no-inferrable-types
  public subTotal: number = 0;
  public balance: number = 0;

  public paginate: Paginate = new Paginate();

  public disabledTracker = false;
  public amountChange: Subject<string> = new Subject();
  public searchSubject: Subject<string> = new Subject();
  public searchTerm = '';
  
  public isModalTrackerOpen = false;
  public isModalPaymentOpen = false;

  constructor(
    private pS: PackageService,
    private aS: AgentService,
    private paS: PaymentService,
    private tS: TypeService,
    private ptS: PackageTrackingService,
    private pagS: PaginateService,
    private sS: SaleService,
    private cdr: ChangeDetectorRef) {
      this.pagS.model = 'packages';
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.getPackages();
  }

  ngOnInit() {
    this.agents$ = this.aS.get();
    this.typeSale$ = this.tS.getAll('cat_type_sales');

    this.amountChange.pipe(debounceTime(300)).subscribe(() => {
      if ((this.payment.amount || 0) > this.balance) {
        this.payment.amount = this.balance;
      }
    });

    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(term => {
      if (term.trim()) {
        this.filters.search = term.trim();
      } else {
        delete this.filters.search;
      }
      this.getPackages();
    });
  }

  clearSearch() {
    this.searchTerm = '';
    delete this.filters.search;
    this.getPackages();
  }

  isLoading = true;
  getPackages() {
    this.isLoading = true;
    setTimeout(() => this.cdr.detectChanges(), 0);
    this.pagS.paginate(this.filters).subscribe(r => {
      this.paginate = r;
      this.packages = r.data; 
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  pageChanged(event: any){
    this.isLoading = true;
    setTimeout(() => this.cdr.detectChanges(), 0);
    this.pagS.getForUrl(event.page, this.filters).subscribe(res => {
      this.paginate = res;
      this.packages = res.data;
      this.isLoading = false;
      this.cdr.detectChanges();
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
      this.payments.forEach((e) => {
          this.subTotal = this.subTotal + parseInt((e.amount || 0).toString(), 10);
      });
      this.balance = ((this.sale.subtotal || 0) - this.subTotal);
      this.sale.is_paid = this.balance <= 0;
      this.isModalPaymentOpen = true;
    });
  }

  onChangeAmount() {
    this.amountChange.next('');
  }

  savePayment() {
    this.printPayment = undefined;
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
      this.isModalPaymentOpen = false;
      iziToast.show({
        message: 'Registro creado'
      });
    });
  }

  copyTicket(p: Payment) {
    this.printPayment = undefined;
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
    this.disabledTracker = ((p.type?.session_count || 0) <= (p.tracking?.length || 0));
    this.tracker = new PackageTracking();
    this.package = p;
    this.tracker.is_taken = true;
    this.tracker.package_id = p.id;
    this.tracker.scheduled_date = '';
    this.getTracking();
    this.isModalTrackerOpen = true;
  }

  getTracking() {
    this.ptS.geForPackage(this.tracker.package_id!).subscribe(r => {
      this.trackers = r.sort((a: any, b: any) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());
    });
  }

  saveTracking() {
    this.tracker.scheduled_date = format(new Date(this.tracker.scheduled_date!), 'yyyy-MM-dd HH:mm:ss');
    this.ptS.post(this.tracker).subscribe(xhr => {
      this.isModalTrackerOpen = false;
      this.getPackages();
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

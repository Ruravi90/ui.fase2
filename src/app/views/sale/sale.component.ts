import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService,
  DepartmentService,
  AgentService,
  TypeService,
  QzTrayService,
  SaleService,
  PillsInventoryService,
  ProductsInventaryService,
  UserService
} from '../../services';
import { Client,
  Department,
  User,
  _Type,
  Sale,
  SaleAdditional,
  Inventory
} from '../../models';
import { NgSelectComponent  } from '@ng-select/ng-select';

import swal from 'sweetalert2';
import { Subject, forkJoin, Observable, of } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, catchError, map } from 'rxjs/operators';

declare var $: any, iziToast: any, document: any;

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-sale',
    imports: [CommonModule, FormsModule, NgSelectModule],
    templateUrl: 'sale.component.html',
    styleUrls: ['./sale.component.scss']
})

export class SaleComponent implements OnInit {
  public currentUser: User = new User();
  public sale: Sale = new Sale();
  public sales: Sale[] = [];
  public salesForDay: Sale[] = [];
  public sumTotal = 0;
  public amount = 0;
  public printSale?: Sale;
  public total = 0;
  public printSales: Sale[] = [];
  public clients$!: Observable<Client[]>;
  public clientInput$ = new Subject<string>();
  public clients: Client[] = [];
  public departments: Department[] = [];
  public agents: User[] = [];
  public cuteSales: Department[] = [];
  public isCopyPrint = false;
  public additional: SaleAdditional = new SaleAdditional();
  public balance = 0;
  public dateNow = new Date();
  public isBusy = false;
  public typeAdditionals: any[] = [];
  public type_additional_id?: string;
  public conceptsAdditionals: _Type[] = [];
  // tslint:disable-next-line:no-inferrable-types
  public type_concept_id?: string;
  public typeConcepts: any[] = [];
  // tslint:disable-next-line:no-inferrable-types
  public concept_id?: number;
  public concepts: _Type[] = [];
  public _selectedConcept: any = {};
  public typeSales: _Type[] = [];

  public department_id: number = undefined as any;
  public inventory: Inventory = undefined as any;
  public selectConceptId!: NgSelectComponent;
  public selectTypeConceptId!: NgSelectComponent;

  private subject: Subject<string> = new Subject();
  private amountChange: Subject<string> = new Subject();

  constructor(private cS: ClientService,
    private dS: DepartmentService,
    private aS: AgentService,
    private tS: TypeService,
    private sS: SaleService,
    private qS: QzTrayService,
    private piS: PillsInventoryService,
    private prS: ProductsInventaryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private userService: UserService,
    ) {
      this.currentUser = this.userService.currentUser;
    }

  ngOnInit(): void {
    this.isLoadingPage = true;
    setTimeout(() => this.cdr.detectChanges(), 0);
    this.setCombos();

    this.clients$ = this.clientInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.cS.paginate(15, term).pipe(
        catchError(() => of({ data: [] }))
      )),
      map((res: any) => res.data.map((e: any) => {
        e.fullname = e.name + ' ' + e.lastname + ' ' + (e.motherlastname ? e.motherlastname : '');
        return e;
      }))
    );

    this.subject.pipe(debounceTime(800))
    .subscribe(() => this.onCalculateTotal());

    this.amountChange.pipe(debounceTime(800))
      .subscribe(() => {
        if ((this.sale.amount || 0) > (this.sale.total || 0)) {
          this.sale.amount = this.sale.total;
        }
    });

    this.getSalesForDay();
  }

  isLoadingPage = true;
  getSalesForDay() {
    this.sS.getSalesUserDay().subscribe(res => {
      this.salesForDay = res.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      this.cdr.detectChanges();
    });
  }

  setCombos() {
    forkJoin([
      this.dS.get(), 
      this.aS.get(),
      this.tS.getAll('cat_type_sales')
    ]).subscribe(r => {
      this.departments = r[0];
      this.agents = r[1];
      this.typeSales = r[2];
      this.isLoadingPage = false;
      this.cdr.detectChanges();
    });

    this.typeConcepts = [
      {id: 'product', name: 'Producto'},
      {id: 'package', name: 'Paquete'},
      {id: 'service', name: 'Servicio'}
    ];

    this.typeAdditionals = [
      {id: 'product', name: 'Producto'},
      {id: 'pill', name: 'Pastillas'}
    ];
  }

  selectedTypeConcept() {
    let url = '';
    this.selectConceptId = null as any;
    this.concept_id = undefined;
    this.inventory = undefined as any;
    this.sale.product_id = undefined;
    this.sale.pill_id = undefined;
    switch (this.type_concept_id) {
      case 'product':
          url = 'cat_products';
          break;
      case 'service':
          url = 'cat_services';
          break;
      case 'package':
          url = 'cat_packages';
          break;
      case 'pill':
          url = 'cat_pills';
          break;
    }
    if (url !== '') {
      this.tS.getAll(url).subscribe(r => {
        this.concepts = r;
      });
    } else {
      this.type_concept_id = undefined;
      this.concepts = [new _Type()];
    }
  }

  selectedConcept() {
    // tslint:disable-next-line:prefer-const
    let index = this.concepts.findIndex(i => i.id === this.concept_id);
    // tslint:disable-next-line:prefer-const
    this._selectedConcept = this.concepts[index];
    this.inventory = undefined as any;
    this.onCalculateTotal();
    switch (this.type_concept_id) {
      case 'product':
          this.sale.product_id = this.concept_id;
          this.sale.cat_product =  this._selectedConcept;
          this.prS.getForProduct(this.concept_id!).subscribe(r => {
            this.inventory = r;
          });
          break;
      case 'service':
          this.sale.service_id = this.concept_id;
          this.sale.cat_service =  this._selectedConcept;
          break;
      case 'package':
          this.sale.package_id = this.concept_id;
          this.sale.cat_package =  this._selectedConcept;
          break;
      case 'pill':
          this.sale.pill_id = this.concept_id;
          this.sale.cat_pill =  this._selectedConcept;
          this.piS.getForPill(this.concept_id!).subscribe(r => {
            this.inventory = r;
          });
          break;
    }
    this.inventory.count = Number(this.inventory.count);
  }

  addSale(isValid: boolean): void | boolean {
    if (!isValid) {
      return false;
    }

    if(this.sale.pill_id != null && this.inventory == null){
      return false;
    }
    if(this.sale.product_id != null && this.inventory == null){
      return false;
    }


    this.sale.user_id = this.currentUser.id;
    this.sales.push(this.sale);
    this.clearForm();
  }

  async deleteSale(index: number) {
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
      this.sales.splice(index, 1);
    });
  }


  async deleteSaleDB(s: Sale) {
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de cancelar la venta',
      icon: 'question',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, cancelar!'
    }).then((result) => {
      this.sS.cancel(s.id!).subscribe((r: any) => {
        this.getSalesForDay();
        iziToast.show({
          message: 'Registro cancelado correctamente'
        });
      });
    });
  }

  selectedTypeAdditional() {
    this.sale = new Sale();
    this.additional = new Sale();
    this.additional.pill_id = undefined;
    this.additional.product_id = undefined;
    this.inventory = undefined as any;
    let url = '';
    this.additional.pill_id = undefined;
    this.additional.product_id = undefined;
    switch (this.type_additional_id) {
      case 'product':
          url = 'cat_products';
          break;
      case 'pill':
          url = 'cat_pills';
          break;
    }
    if (url !== '') {
      this.tS.getAll(url).subscribe(r => {
        this.conceptsAdditionals = r;
      });
    } else {
      this.type_additional_id = undefined;
      this.conceptsAdditionals = [];
    }
  }

  setConceptAdditionals() {
    this.conceptsAdditionals = [];
    this.additional.price = 0;
    this.inventory = undefined as any;
    let index = 0;
    switch (this.type_additional_id) {
      case 'product':
          index = this.conceptsAdditionals.findIndex(i => i.id === this.additional.product_id);
          this.additional.cat_product = this.conceptsAdditionals[index];
          this.prS.getForProduct(this.additional.product_id!).subscribe(r => {
            this.inventory = r;
          });
          break;
      case 'pill':
          index = this.conceptsAdditionals.findIndex(i => i.id === this.additional.pill_id);
          this.additional.cat_pill = this.conceptsAdditionals[index];
          this.piS.getForPill(this.additional.pill_id!).subscribe(r => {
            this.inventory = r;
          });
          break;
    }
  }

  addAdditional() {
    this.sale.additionals.push(this.additional);
    this.clearAdditional();
  }

  clearAdditional() {
    this.additional = new SaleAdditional();
    this.type_additional_id = undefined;
    this.conceptsAdditionals = [];
  }

  async deleteAdditional(index: number) {
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
      this.sale.additionals.splice(index, 1);
    });
  }

  onCalculateTotal() {
    this.sale.price = Number(this._selectedConcept.price);
    this.sale.subtotal =  this.sale.price * (this.sale.count || 0);
    if ((this.sale.discount || 0) > 0) {
      const discount = this.sale.price * (this.sale.discount! / 100);
      this.sale.subtotal =  (this.sale.price - discount) * (this.sale.count || 0);
    } else {
      this.sale.subtotal =  this.sale.price * (this.sale.count || 0);
    }
    if (typeof this.sale.discount !== 'undefined') {
      this._selectedConcept.discount = ((Number(this.sale.discount) * this.sale.subtotal) / 100);
    } else {
      this._selectedConcept.discount = 0;
    }

    this.sale.subtotal = this.sale.subtotal - Number(this._selectedConcept.discount);
    this.sale.total = this.sale.subtotal;
  }

  onDebounce() {
    this.subject.next('');
  }

  onChangeAmount() {
    this.amountChange.next('');
  }

  clearForm() {
    this.sale = new Sale();
    this.sale.user_id = this.currentUser.id;
    this.type_concept_id = undefined;
    this.typeConcepts = [];
    this.selectConceptId = undefined as any;
    this.concept_id = undefined;
    this.type_additional_id = undefined;
    this.conceptsAdditionals = [];

    this.setCombos();
  }

  saveSales(): void | boolean {
    if(this.isBusy)
      return false;

    this.isBusy = true;
    this.sS.post(this.sales).subscribe(r => {
      this.sales = [];
      this.isCopyPrint = true;
      this.getSalesForDay();
      this.copyTicket(r);
      this.offerScheduleFirstSession(r);
      this.isBusy = false;
    });
  }

  private offerScheduleFirstSession(primary: Sale): void {
    const packageLine = primary.sales?.find(s => s.package_id);
    const packageInstanceId = packageLine?.packages?.[0]?.id;
    const clientId = primary.client_id || packageLine?.client_id;

    if (!packageLine || !clientId || !packageInstanceId) {
      return;
    }

    swal.fire({
      title: 'Venta exitosa',
      text: '¿Deseas agendar la primera sesión de este paquete?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Agendar 1ra Sesión',
      cancelButtonText: 'Después',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/page/schedule'], {
          queryParams: { client_id: clientId, package_id: packageInstanceId }
        });
      }
    });
  }

  printTicket() {
    this.dateNow = new Date();
    this.printToCart('printTicket');
  }

  copyTicket(s: Sale) {
    this.sS.getById(s.id!).subscribe(res => {
      this.cuteSales = [];
      this.printSale = res;
      this.printSale.sumTotal = 0;
      this.printSale.sales.forEach((e: any) => {
        this.printSale!.sumTotal = (this.printSale!.sumTotal || 0) + Number(e.amount);
      });

      this.cdr.detectChanges();
      setTimeout(() => {
        this.printTicket();
      }, 500);
    });
  }

  printCopyTicke(s: Sale) {
    this.copyTicket(s);
  }

  async getCuteSales(): Promise<void | boolean> {
    if(this.isBusy)
      return false;
    this.isBusy = true;

    let that = this;
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de continuar',
      icon: 'question',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Generar corte!'
    }).then((result) => {
      this.sS.getCuteSales().subscribe((r: any) => {
        this.printSale = undefined;
        this.cuteSales = r;
        this.cuteSales.forEach((d: any) => {
          d.sumCardTotal = 0;
          d.sumCashTotal = 0;
          d.sales.forEach((s: any) => {
            s.sumCashTotal = 0;
            s.sumCardTotal = 0;
            s.sales.forEach((ss: any) => {
              ss.payments.forEach((p: any) => {
                if(p.type.id === 1){
                  s.sumCashTotal = (s.sumCashTotal || 0) + Number(p.amount);
                }
                else{
                  s.sumCardTotal = (s.sumCardTotal || 0) + Number(p.amount);
                }
              });
            });
            d.sumCardTotal = (d.sumCardTotal || 0) + (s.sumCardTotal || 0);
            d.sumCashTotal = (d.sumCashTotal || 0) + (s.sumCashTotal || 0);
          });
        });

        this.getSalesForDay();
        if (this.cuteSales !== null) {
          this.cdr.detectChanges();
          setTimeout(() => {
            this.isBusy = false;
            that.printTicket();
          }, 500);
        }
      });
    });
  }

/**
 *
 *
 * @param {string} id
 * @memberof SalesComponent
 */
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
            <base href="${window.location.origin}/">
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
}

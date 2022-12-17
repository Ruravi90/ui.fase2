import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Validation from '../../utils/validation';

import { ClientService,
  DepartmentService,
  AgentService,
  TypeService,
  SaleService,
  ProductsInventaryService
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
import { Subject, forkJoin } from 'rxjs';
import * as print from 'print-js';

declare var $: any, iziToast: any, document: any;

@Component({
  templateUrl: 'sale.component.html',
  styleUrls: ['./sale.component.css'],
})

export class SaleComponent implements OnInit {
  public currentUser: User = new User();
  public sale: Sale = new Sale();
  public sales: Sale[] = [];
  public salesForDay: Sale[] = [];
  public cuteSales: Department[] = [];
  public printSale?: Sale;
  public isCopyPrint = false;
  public sumSales = 0;
  public clients: Client[] = [];
  public departments: Department[] = [];
  public agents: User[] = [];
  public additional: SaleAdditional = new SaleAdditional();
  public typeAdditionals: any[] = [];
  public type_additional_id?: string;
  public conceptsAdditionals: _Type[] = [];
  public type_concept_id?: string;
  public typeConcepts: any[] = [];
  public concept_id?: number;
  public concepts: _Type[] = [];
  public _selectedConcept: any = {};
  public typeSales: _Type[] = [];
  public inventory?: Inventory;
  public isBusy = false;
  public dateNow: Date = new Date();
  public selectTypeConceptId:string | null = null;
  public selectConceptId:string | null  = null;

  private subject: Subject<string> = new Subject();
  private amountChange: Subject<string> = new Subject();

  formSale: FormGroup = new FormGroup({
    departmentId: new FormControl(''),
    clientId: new FormControl(''),
    responsibleId: new FormControl(''),
    typeConceptId: new FormControl(''),
    conceptId: new FormControl(''),
    count: new FormControl(''),
    discount: new FormControl(''),
    typeSalesId: new FormControl(''),
    amount: new FormControl(''),
  });


  constructor(private formBuilder: FormBuilder,
    private cS: ClientService,
    private dS: DepartmentService,
    private aS: AgentService,
    private tS: TypeService,
    private sS: SaleService,
    private prS: ProductsInventaryService,
    ) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      this.setCombos();
  }

  ngOnInit(): void {
    this.formSale = this.formBuilder.group(
      {
        departmentId: [],
        clientId: [],
        responsibleId: [],
        typeConceptId: [],
        conceptId: [],
        count: [],
        discount: [],
        typeSalesId: [],
        amount: [],
      }
    );

    this.getSalesForDay();
  }

  ngAfterViewInit() {
    this.formSale.validator;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formSale.controls;
  }

  getSalesForDay() {
    this.sS.getSalesUserDay().subscribe(res => {
      this.salesForDay = res;
    });
  }

  setCombos() {
    forkJoin([
      this.cS.get(),
      this.dS.get(),
      this.aS.get(),
      this.tS.getAll('cat_type_sales')
    ]).subscribe(r => {
      this.clients = [];
      r[0].forEach((e)=>{
        e.fullname = e.name + ' ' + e.lastname + ' ' + (e.motherlastname?e.motherlastname:'');
        this.clients.push(e);
      });
      console.log(this.clients);
      this.departments = r[1];
      this.agents = r[2];
      this.typeSales = r[3];
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
    this.selectConceptId = null;
    this.formSale.value.conceptId = undefined;
    this.inventory =  undefined;
    this.sale.product_id = undefined;
    this.sale.pill_id = undefined;
    this.concepts = [new _Type()];

    switch (this.formSale.value.typeConceptId) {
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
    }
  }

  selectedConcept() {
    // tslint:disable-next-line:prefer-const
    let index = this.concepts.findIndex(i => i.id === this.formSale.value.conceptId);
    // tslint:disable-next-line:prefer-const
    this._selectedConcept = this.concepts[index];
    this.inventory = undefined;
    this.onCalculateTotal();
    switch (this.formSale.value.typeConceptId) {
      case 'product':
          this.sale.product_id = this.formSale.value.conceptId;
          this.sale.cat_product =  this._selectedConcept;
          this.prS.getForProduct(this.formSale.value.conceptId!).subscribe(r => {
            this.inventory = r;
          });
          break;
      case 'service':
          this.sale.service_id = this.formSale.value.conceptId;
          this.sale.cat_service =  this._selectedConcept;
          break;
      case 'package':
          this.sale.package_id = this.formSale.value.conceptId;
          this.sale.cat_package =  this._selectedConcept;
          break;
    }

    if(this.inventory != undefined){
      this.inventory = new Inventory();
      this.inventory!.count = Number(this.inventory!.count);
    }

  }

  addSale(form: FormGroup) {
    if (!form.valid) {
      console.log(form);
      return ;
    }

    if(this.sale.product_id != null && this.inventory == null){
      return ;
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
      if(result.isConfirmed)
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
      if(result.isConfirmed){
        this.sS.cancel(s.id!).subscribe(r => {
          this.getSalesForDay();
          iziToast.show({
            message: 'Registro cancelado correctamente'
          });
        });
      }
    });
  }

  selectedTypeAdditional() {
    let url = '';
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

  selectedAdditional() {
    let index = 0;
    this.inventory = undefined;
    switch (this.type_additional_id) {
      case 'product':
          index = this.conceptsAdditionals.findIndex(i => i.id === this.additional.product_id);
          this.additional.cat_product = this.conceptsAdditionals[index];
          this.prS.getForProduct(this.additional.product_id!).subscribe(r => {
            this.inventory = r;
          });
          break;
    }
  }

  addAdditional() {
    this.sale.additionals.push(this.additional);
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
      if(result.isConfirmed)
        this.sale.additionals.splice(index, 1);
    });
  }

  onCalculateTotal() {
    if(typeof this._selectedConcept != "undefined")
    {
      this.sale.price = Number(this._selectedConcept.price);
      this.sale.subtotal =  this.sale.price * this.formSale.value.count!;
      if (typeof this.sale.discount !== 'undefined') {
        this._selectedConcept.discount = ((Number(this.sale.discount) * this.sale.subtotal) / 100);
      } else {
        this._selectedConcept.discount = 0;
      }

      this.sale.subtotal = this.sale.subtotal - Number(this._selectedConcept.discount);
      this.sale.total = this.sale.subtotal;
    }
  }

  onDebounce() {
    window.setTimeout(() => {
      this.onCalculateTotal();
    }, 800);
  }

  onChangeAmount() {
    window.setTimeout(() => {
      if (this.sale.amount! > this.sale.total!) {
        this.sale.amount = this.sale.total;
      }
    }, 800);
  }

  clearForm() {
    this.sale = new Sale();
    this.sale.user_id = this.currentUser.id;
    this.type_concept_id = undefined;
    this.typeConcepts = [];
    this.selectConceptId = null;
    this.concept_id = undefined;
    this.type_additional_id = undefined;
    this.conceptsAdditionals = [];

    this.formSale = this.formBuilder.group(
      {
        departmentId: [],
        clientId: [],
        responsibleId: [],
        typeConceptId: [],
        conceptId: [],
        count: [],
        discount: [],
        typeSalesId: [],
        amount: [],
      }
    );

    this.setCombos();
  }

  saveSales() {
    if(this.isBusy)
      return;

    this.isBusy = true;
    this.sS.post(this.sales).subscribe(r => {
      this.sales = [];
      this.isCopyPrint = true;
      this.getSalesForDay();
      this.copyTicket(r);

      this.isBusy = false;
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
      this.printSale.sales.forEach((e, i) => {
        this.printSale!.sumTotal =  this.printSale!.sumTotal! + Number(e.amount);
      });

      setTimeout(() => {
        this.printTicket();
      }, 500);
    });
  }

  printCopyTicke(s: Sale) {
    this.copyTicket(s);
  }

  async getCuteSales() {
    if(this.isBusy)
      return;
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
      this.sS.getCuteSales().subscribe(r => {
        this.printSale = undefined;
        this.cuteSales = r;
        this.cuteSales.forEach((d, i) => {
          this.cuteSales[i].sumCardTotal = 0;
          this.cuteSales[i].sumCashTotal = 0;
          d.sales!.forEach((s, i2) => {
            this.cuteSales[i].sales![i2].sumCashTotal = 0;
            this.cuteSales[i].sales![i2].sumCardTotal = 0;
            s.sales.forEach((ss, i3) => {
              ss.payments.forEach((p, i4) => {
                if(p.type!.id === 1){
                  this.cuteSales[i].sales![i2].sumCashTotal = this.cuteSales[i].sales![i2].sumCashTotal! + Number(p.amount);
                }
                else{
                  this.cuteSales[i].sales![i2].sumCardTotal = this.cuteSales[i].sales![i2].sumCardTotal! + Number(p.amount);
                }
              });
            });
            this.cuteSales[i].sumCardTotal = this.cuteSales[i].sumCardTotal! + this.cuteSales[i].sales![i2].sumCardTotal!;
            this.cuteSales[i].sumCashTotal = this.cuteSales[i].sumCashTotal! + this.cuteSales[i].sales![i2].sumCashTotal!;
          });
        });

        this.getSalesForDay();
        if (this.cuteSales !== null) {
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
    print( {
        printable: printSectionId,
        type: 'html',
        css: 'assets/css/print.css',
        scanStyles: true,
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
}

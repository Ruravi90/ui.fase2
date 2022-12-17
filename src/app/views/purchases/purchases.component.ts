import { Component, OnInit } from '@angular/core';
import { PurchaseService, DepartmentService, CreditorService, TypeService } from '../../services';
import { Purchase, _Type, User, Paginate } from '../../models';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
declare var $: any, iziToast: any;

@Component({
  templateUrl: 'purchases.component.html',
  styleUrls:['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {
  public currentUser: User = new User();
  public purchases: Purchase[] = [];
  public _purchases: Purchase[] = [];
  public cmbDepartment$!: Observable<_Type[]>;
  public cmbCreditors$!: Observable<_Type[]>;
  public cmbExpenses$!: Observable<_Type[]>;
  public cmbProducts$!: Observable<_Type[]>;
  public cmbPills$!: Observable<_Type[]>;
  public cmbConcepts$!: Observable<_Type[]>;
  public purchase: Purchase = new Purchase();
  public isEdit = false;
  public paginate: Paginate = new Paginate();
  public filters: any = { isPaid: 'null', perPage:15 };

  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  constructor(private pS: PurchaseService, private dS: DepartmentService, private cS: CreditorService, private tS: TypeService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  }

  ngOnInit(): void {
    this.clearForm();
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

  setCombos() {
    this.cmbDepartment$ = this.dS.get();
    this.cmbCreditors$ = this.cS.get();
    this.cmbExpenses$ = this.tS.getAll('cat_expenses');
    this.cmbProducts$ = this.tS.getAllWhitOthers('cat_products');
    this.cmbPills$ = this.tS.getAllWhitOthers('cat_pills');
    this.cmbConcepts$ = this.tS.getAllWhitOthers('cat_concepts');
  }

  addPurchare() {
    this.cmbExpenses$.subscribe(r => {
      this.purchase.cat_expense = r.find(i => i.id === this.purchase.expense_id);
      this.cmbDepartment$.subscribe(r => {
        this.purchase.department = r.find(i => i.id === this.purchase.department_id);
        setTimeout(() => {
          this.purchase.user_id = this.currentUser.id;
          this._purchases.push(Object.assign({}, this.purchase));
          this.clearForm();
        }, 500);
      });
    });
  }

  clearForm() {
    this.purchase = new Purchase();
    this.purchase.is_paid = true;
    this.purchase.product_count = 0;
    this.purchase.pill_count = 0;
    this.setCombos();
  }

  async delete(index: number) {
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
        this._purchases.splice(index, 1);
      }
    });
  }

  toggleIsPaid(e:any){
    this.purchase.is_paid = e.target.checked;
  }

  save() {
    this.pS.post(this._purchases).subscribe(r => {
      this.toast.fire({
        icon:'success',
        title: 'Registro creado'
      });
      this._purchases = [];
      this.getCatlog();
    });
  }

}

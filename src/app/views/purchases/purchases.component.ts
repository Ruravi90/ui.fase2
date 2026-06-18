import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { PurchaseService, DepartmentService, CreditorService, TypeService } from '../../services';
import { Purchase, _Type, User, Paginate } from '../../models';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PaginationModule],
  templateUrl: 'purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
  currentUser: User = new User();
  purchases: Purchase[] = [];
  _purchases: Purchase[] = [];
  cmbDepartment$!: Observable<_Type[]>;
  cmbCreditors$!: Observable<_Type[]>;
  cmbExpenses$!: Observable<_Type[]>;
  cmbProducts$!: Observable<_Type[]>;
  cmbPills$!: Observable<_Type[]>;
  cmbConcepts$!: Observable<_Type[]>;
  purchase: Purchase = new Purchase();
  isEdit = false;
  paginate: Paginate = new Paginate();
  filters: any = { isPaid: 'null', perPage: 15 };
  saving = false;
  loading = false;

  get cartTotal(): number {
    return this._purchases.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }

  constructor(
    private pS: PurchaseService,
    private dS: DepartmentService,
    private cS: CreditorService,
    private tS: TypeService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this.clearForm();
    this.getCatlog();
  }

  getCatlog() {
    this.loading = true;
    this.pS.paginate(this.filters).subscribe({
      next: (r: any) => {
        this.paginate = r;
        this.purchases = r.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  pageChanged(event: any) {
    this.loading = true;
    this.pS.getForUrl(event.page, this.filters).subscribe({
      next: (r: any) => {
        this.paginate = r;
        this.purchases = r.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
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
          Swal.fire({
            toast: true, position: 'top-end', icon: 'success',
            title: 'Egreso añadido al carrito', showConfirmButton: false, timer: 1500
          });
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

  delete(index: number) {
    Swal.fire({
      title: '¿Eliminar del carrito?',
      text: 'Se quitará este egreso de la lista.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e85d5d',
      cancelButtonColor: '#bdc3c7',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this._purchases.splice(index, 1);
      }
    });
  }

  toggleIsPaid(e: any) {
    this.purchase.is_paid = e.target.checked;
  }

  save() {
    this.saving = true;
    this.pS.post(this._purchases).subscribe({
      next: () => {
        this.saving = false;
        this._purchases = [];
        this.getCatlog();
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: 'Egresos registrados correctamente', showConfirmButton: false, timer: 2500
        });
      },
      error: () => {
        this.saving = false;
        Swal.fire('Error', 'No se pudieron guardar los egresos.', 'error');
      }
    });
  }
}

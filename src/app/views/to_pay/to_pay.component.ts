import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PurchaseService } from '../../services';
import { Purchase, Paginate } from '../../models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-to-pay',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationModule],
  templateUrl: 'to_pay.component.html',
  styleUrls: ['./to_pay.component.scss']
})
export class ToPayComponent implements OnInit {
  purchases: Purchase[] = [];
  paginate: Paginate = new Paginate();
  filters: any = { isPaid: 0, perPage: 15 };
  loading = false;

  constructor(private pS: PurchaseService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getCatlog();
  }

  getCatlog() {
    this.loading = true;
    this.pS.paginate(this.filters).subscribe({
      next: (r) => {
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
    this.pS.getForUrl(event.page, this.filters.perPage).subscribe({
      next: (r) => {
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

  getTotalPage(): number {
    return (this.purchases || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }

  pay(item: Purchase) {
    Swal.fire({
      title: '¿Confirmar pago?',
      html: `<p style="color:#555;font-size:0.95rem">Marcarás como pagado el egreso por <strong>${this.formatCurrency(item.amount)}</strong>${item.provider ? ' de <strong>' + item.provider.business_name + '</strong>' : ''}.</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#84A59D',
      cancelButtonColor: '#bdc3c7',
      confirmButtonText: 'Sí, pagar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.pS.pay(item).subscribe({
          next: () => {
            this.getCatlog();
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Egreso marcado como pagado',
              showConfirmButton: false,
              timer: 2000
            });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo procesar el pago', 'error');
          }
        });
      }
    });
  }

  private formatCurrency(amount: any): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(amount || 0));
  }
}

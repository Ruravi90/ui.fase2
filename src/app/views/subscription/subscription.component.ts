import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public plans: any[] = [];
  public currentPlanId = 1;
  public loading = false;
  private apiUrl = environment.urlApi;
  public debugRes: any = 'Cargando...';

  public promoCodeInput: { [key: number]: string } = {};
  public appliedPromoCode: { [key: number]: any } = {};
  public promoCodeError: { [key: number]: string } = {};

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    console.log('[DEBUG] Starting loadPlans call to:', this.apiUrl + 'saas/available-plans');
    this.http.get<any>(this.apiUrl + 'saas/available-plans').subscribe({
      next: (res) => {
        console.log('[DEBUG] loadPlans next() fired. res:', res);
        this.debugRes = res;
        this.plans = res?.plans || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[DEBUG] loadPlans error() fired:', err);
        this.debugRes = 'ERROR: ' + err.message;
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error HTTP', 'Detalle: ' + err.message, 'error');
      },
      complete: () => {
        console.log('[DEBUG] loadPlans complete() fired.');
      }
    });
  }

  public selectedPlanForCheckout: any = null;
  public checkoutCode = '';
  public checkoutAppliedCode: any = null;
  public checkoutError = '';
  public checkoutDiscount = 0;
  public checkoutTotal = 0;

  public openCheckout(plan: any) {
    this.selectedPlanForCheckout = plan;
    this.checkoutCode = '';
    this.checkoutAppliedCode = null;
    this.checkoutError = '';
    this.checkoutDiscount = 0;
    this.checkoutTotal = parseFloat(plan.price);
    // Asumimos que tenemos Bootstrap JS para abrir el modal, o manejamos el div oculto con ngIf
  }

  public closeCheckout() {
    this.selectedPlanForCheckout = null;
  }

  public applyCheckoutPromoCode() {
    if (!this.checkoutCode) return;
    this.loading = true;
    this.checkoutError = '';
    
    this.http.post<any>(this.apiUrl + 'saas/promo-codes/validate', { code: this.checkoutCode, plan_id: this.selectedPlanForCheckout.id }).subscribe({
      next: (res) => {
        this.loading = false;
        this.checkoutAppliedCode = res;
        
        const price = parseFloat(this.selectedPlanForCheckout.price);
        this.checkoutDiscount = price * (res.percentage / 100);
        this.checkoutTotal = price - this.checkoutDiscount;
        
        this.cdr.detectChanges();
        Swal.fire('¡Código Aplicado!', `Descuento de ${res.percentage}% aplicado correctamente.`, 'success');
      },
      error: (err) => {
        this.loading = false;
        this.checkoutError = err.error?.message || 'Código inválido o expirado';
        this.checkoutAppliedCode = null;
        this.checkoutDiscount = 0;
        this.checkoutTotal = parseFloat(this.selectedPlanForCheckout.price);
        this.cdr.detectChanges();
      }
    });
  }

  public confirmAndPay() {
    if (!this.selectedPlanForCheckout) return;
    
    this.loading = true;
    Swal.fire({
      title: 'Generando pago...',
      text: 'Conectando con Mercado Pago',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const payload: any = { plan_id: this.selectedPlanForCheckout.id };
    if (this.checkoutAppliedCode) {
      payload.promo_code_id = this.checkoutAppliedCode.id;
    }

    this.http.post<any>(this.apiUrl + 'saas/payment/preference', payload).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.close();
        if (res.init_point) {
          window.location.href = res.init_point;
        } else {
          Swal.fire('Error', 'No se generó el enlace de pago', 'error');
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        Swal.fire('Error', 'Hubo un error al conectar con Mercado Pago', 'error');
      }
    });
  }
}

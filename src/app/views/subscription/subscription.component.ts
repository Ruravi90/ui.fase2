import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public plans: any[] = [];
  public currentPlanId = 1;
  public loading = false;
  private apiUrl = environment.urlApi;
  public debugRes: any = 'Cargando...';

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

  public payWithMercadoPago(plan: any) {
    this.loading = true;
    Swal.fire({
      title: 'Generando pago...',
      text: 'Conectando con Mercado Pago',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(this.apiUrl + 'saas/payment/preference', { plan_id: plan.id }).subscribe({
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

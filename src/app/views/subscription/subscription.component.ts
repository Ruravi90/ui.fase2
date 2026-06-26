import { Component, OnInit } from '@angular/core';
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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    this.http.get<any>(this.apiUrl + 'saas/available-plans').subscribe({
      next: (res) => {
        this.plans = res.plans || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los planes disponibles', 'error');
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

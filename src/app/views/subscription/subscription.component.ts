import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Plan {
  id: number;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public plans: Plan[] = [
    {
      id: 1,
      name: 'Prueba 1 Mes',
      price: 0,
      features: ['Módulo de Ventas', 'Inventario Básico', 'Soporte Comunitario']
    },
    {
      id: 2,
      name: 'Plan Pro',
      price: 500,
      features: ['Módulo de Ventas', 'Inventario Avanzado', 'Soporte 24/7', 'Módulo de Gastos', 'Reportes Avanzados'],
      recommended: true
    }
  ];

  public currentPlanId = 1;

  constructor() { }

  ngOnInit(): void {
  }

  public payWithMercadoPago(plan: Plan) {
    // Aquí se generaría la preferencia de Mercado Pago llamando a la API
    // this.http.post('/api/v1/payments/preference', { plan_id: plan.id })
    //   .subscribe(res => window.location.href = res.checkout_url);

    alert(`Redirigiendo a Mercado Pago para pagar ${plan.name} por $${plan.price}...`);
  }
}

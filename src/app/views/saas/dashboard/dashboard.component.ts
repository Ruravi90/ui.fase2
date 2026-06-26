import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SaasService } from '../../../services/saas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  stats: any = {
    total_tenants: 0,
    active_subscriptions: 0,
    monthly_revenue: 0,
    plans_distribution: [],
    recent_tenants: []
  };
  
  loading = false;

  constructor(private saasService: SaasService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.saasService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', 'No se pudo cargar el resumen del panel', 'error');
      }
    });
  }

  // Método auxiliar para calcular el porcentaje de las barras CSS
  getPercentage(count: number): number {
    if (this.stats.active_subscriptions === 0) return 0;
    return Math.round((count / this.stats.active_subscriptions) * 100);
  }
}

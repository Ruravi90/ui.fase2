import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../../services';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, NgxChartsModule],
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  salesChart: any[] = [];
  sales: any[] = [];
  packagesChart: any[] = [];
  packages: any[] = [];
  servicesChart: any[] = [];
  services: any[] = [];
  departmentsChart: any[] = [];
  paymentMethodsChart: any[] = [];
  summary: any = {};
  kpis: any[] = [];
  topSellers: any = { packages: [], services: [], products: [] };
  activity: any[] = [];
  alerts: any[] = [];
  isLoading = true;

  constructor(private bS: BalanceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => this.cdr.detectChanges(), 0);
    forkJoin({
      summary: this.bS.getDashboardSummary(),
      sales: this.bS.getSaleChart(),
      packages: this.bS.getPackageChart(),
      services: this.bS.getServiceChart(),
      departments: this.bS.getDepartmentChart(),
      paymentMethods: this.bS.getPaymentMethodsChart(),
      topSellers: this.bS.getTopSellers(),
      activity: this.bS.getRecentActivity(),
      alerts: this.bS.getAlerts()
    }).subscribe((res: any) => {
      this.summary = res.summary || {};
      this.sales = res.sales || [];
      this.packages = res.packages || [];
      this.services = res.services || [];
      this.topSellers = res.topSellers || { packages: [], services: [], products: [] };
      this.activity = res.activity || [];
      this.alerts = res.alerts || [];

      this.salesChart = this.sales.map((element: any) => ({
        name: element.date,
        value: Number(element.sales || 0)
      }));

      this.packagesChart = this.packages.map((element: any) => ({
        name: element.cat_package ? element.cat_package.name : 'Paquete',
        value: Number(element.sales || 0)
      }));

      this.servicesChart = this.services.map((element: any) => ({
        name: element.cat_service ? element.cat_service.name : 'Servicio',
        value: Number(element.sales || 0)
      }));

      this.departmentsChart = (res.departments || []).map((element: any) => ({
        name: element.department ? element.department.name : 'Departamento',
        value: Number(element.total || 0)
      }));

      this.paymentMethodsChart = (res.paymentMethods || []).map((element: any) => ({
        name: element.type ? element.type.name : 'Pago',
        value: Number(element.total || 0)
      }));

      this.kpis = [
        { label: 'Ingresos hoy', value: this.summary.revenueToday || 0, format: 'currency', icon: 'fa-arrow-trend-up', tone: 'mint' },
        { label: 'Ventas del mes', value: this.summary.salesMonth || 0, format: 'number', icon: 'fa-receipt', tone: 'rose' },
        { label: 'Por cobrar', value: this.summary.pendingAmount || 0, format: 'currency', icon: 'fa-clock', tone: 'amber' },
        { label: 'Paquetes activos', value: this.summary.activePackages || 0, format: 'number', icon: 'fa-layer-group', tone: 'sage' },
        { label: 'Inventario bajo', value: (this.summary.lowStockProducts || 0) + (this.summary.lowStockPills || 0), format: 'number', icon: 'fa-box-open', tone: 'slate' }
      ];

      this.isLoading = false;
      this.cdr.detectChanges();
    }, (error) => {
      console.error('Error in forkJoin:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  setLabelFormatting(c: any): string {
    return c;
  }

  getPackageName(v:string){
    const value = this.packages.find(s=> s.sales == v);
    return v + ' ' + (value? value.cat_package.name:'');
  }

  getSaleName(v:string){
    return v + ' ventas' ;
  }

  getServiceName(v:string){
    const value = this.services.find(s=> s.sales == v);
    return v + ' ' + (value? value.cat_service.name:'');
  }

  getKpiValue(kpi: any): string {
    if (kpi.format === 'currency') {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(kpi.value);
    }

    return new Intl.NumberFormat('es-MX').format(kpi.value);
  }

  getSellerName(item: any, type: string): string {
    if (type === 'packages') {
      return item.cat_package?.name || 'Paquete';
    }

    if (type === 'services') {
      return item.cat_service?.name || 'Servicio';
    }

    return item.cat_product?.name || 'Producto';
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'payment':
        return 'fa-clock';
      case 'package':
        return 'fa-layer-group';
      default:
        return 'fa-triangle-exclamation';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'payment':
        return 'fa-credit-card';
      case 'purchase':
        return 'fa-cart-shopping';
      default:
        return 'fa-receipt';
    }
  }
}

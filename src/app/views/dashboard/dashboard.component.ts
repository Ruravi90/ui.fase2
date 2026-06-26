import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService, ProductsInventaryService, PillsInventoryService } from '../../services';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, NgxChartsModule],
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
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
  criticalInventory: any[] = [];
  isLoading = true;

  // Infinite scroll
  activityPage = 1;
  activityHasMore = true;
  activityLoading = false;
  private sentinelObserver?: IntersectionObserver;

  @ViewChild('activitySentinel') activitySentinel?: ElementRef;

  constructor(
    private bS: BalanceService, 
    private pS: ProductsInventaryService,
    private piS: PillsInventoryService,
    private cdr: ChangeDetectorRef
  ) {}

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
      alerts: this.bS.getAlerts(),
      productsInv: this.pS.getAll(),
      pillsInv: this.piS.getAll()
    }).subscribe((res: any) => {
      this.summary = res.summary || {};
      this.sales = res.sales || [];
      this.packages = res.packages || [];
      this.services = res.services || [];
      this.topSellers = res.topSellers || { packages: [], services: [], products: [] };
      this.activity = res.activity?.data || [];
      this.activityHasMore = res.activity?.has_more ?? false;
      this.alerts = res.alerts || [];

      const criticalProducts = (res.productsInv || [])
        .filter((i: any) => i.count <= 20)
        .map((i: any) => ({ name: i.product?.name, count: i.count, type: 'product' }));
      const criticalPills = (res.pillsInv || [])
        .filter((i: any) => i.count <= 20)
        .map((i: any) => ({ name: i.pill?.name, count: i.count, type: 'pill' }));
      
      this.criticalInventory = [...criticalProducts, ...criticalPills].sort((a, b) => a.count - b.count);

      this.salesChart = this.sales.map((element: any) => ({
        name: element.date,
        value: Number(element.sales || 0)
      }));

      this.packagesChart = this.packages.slice(0, 5).map((element: any) => ({
        name: element.cat_package ? element.cat_package.name : 'Paquete',
        value: Number(element.sales || 0)
      }));

      this.servicesChart = this.services.slice(0, 5).map((element: any) => ({
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
        { label: 'Ingresos hoy', value: this.summary.revenueToday || 0, format: 'currency', icon: 'fa-chart-line', tone: 'mint' },
        { label: 'Ventas del mes', value: this.summary.salesMonth || 0, format: 'number', icon: 'fa-receipt', tone: 'rose' },
        { label: 'Por cobrar', value: this.summary.pendingAmount || 0, format: 'currency', icon: 'fa-clock', tone: 'amber' },
        { label: 'Paquetes activos', value: this.summary.activePackages || 0, format: 'number', icon: 'fa-layer-group', tone: 'sage' },
        { label: 'Inventario bajo', value: (this.summary.lowStockProducts || 0) + (this.summary.lowStockPills || 0), format: 'number', icon: 'fa-box-open', tone: 'slate' }
      ];

      this.isLoading = false;
      this.cdr.detectChanges();
      // Setup infinite scroll after initial load
      setTimeout(() => this.setupSentinel(), 100);
    }, (error) => {
      console.error('Error in forkJoin:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    // Sentinel may not exist until data loads; setupSentinel is called after load
  }

  setupSentinel(): void {
    if (this.sentinelObserver) this.sentinelObserver.disconnect();
    const sentinel = document.getElementById('activity-sentinel');
    if (!sentinel) return;
    this.sentinelObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.activityHasMore && !this.activityLoading) {
        this.loadMoreActivity();
      }
    }, { threshold: 0.1 });
    this.sentinelObserver.observe(sentinel);
  }

  loadMoreActivity(): void {
    if (!this.activityHasMore || this.activityLoading) return;
    this.activityLoading = true;
    this.activityPage++;
    this.bS.getRecentActivity(this.activityPage).subscribe((res: any) => {
      this.activity = [...this.activity, ...(res.data || [])];
      this.activityHasMore = res.has_more;
      this.activityLoading = false;
      this.cdr.detectChanges();
    }, () => {
      this.activityLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.sentinelObserver) this.sentinelObserver.disconnect();
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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../../views/dashboard/dashboard.component';
import { ClientsComponent } from '../../views/clients/clients.component';
import { SaleComponent } from '../../views/sale/sale.component';
import { PackagesComponent } from '../../views/packages/packages.component';
import { SalesComponent } from '../../views/sales/sales.component';
import { BoxComponent } from '../../views/box/box.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'sale',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'clients',
        component: ClientsComponent,
        data: {
          title: 'Clientes'
        }
      },
      {
        path: 'sale',
        component: SaleComponent,
        data: {
          title: 'Punto de venta'
        }
      },
      {
        path: 'sales',
        component: SalesComponent,
        data: {
          title: 'Ventas'
        }
      },
      {
        path: 'box',
        component: BoxComponent,
        data: {
          title: 'Balance'
        }
      },
      {
        path: 'packages',
        component: PackagesComponent,
        data: {
          title: 'Paquetes'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {
// tslint:disable-next-line:eofline
}

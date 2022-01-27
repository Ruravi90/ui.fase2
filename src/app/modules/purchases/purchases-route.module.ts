import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { PurchasesComponent } from '../../views/purchases/purchases.component';
import { ToPayComponent } from '../../views/to_pay/to_pay.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Egresos'
    },
    children: [
      {
        path: '',
        redirectTo: 'capture_purchase',
        pathMatch: 'full',
      },
      {
        path: 'capture_purchase',
        component: PurchasesComponent,
        data: {
          title: 'Registrar egreso'
        }
      },
      {
        path: 'to_pay',
        component: ToPayComponent,
        data: {
          title: 'Egresos por pagar'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule {}

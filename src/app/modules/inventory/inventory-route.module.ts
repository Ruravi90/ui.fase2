import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsInventoryComponent } from '../../views/products_inventory/products_inventory.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'products_inventory',
        pathMatch: 'full',
      },
      {
        path: 'products_inventory',
        component: ProductsInventoryComponent,
        data: {
          title: 'Productos'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {
// tslint:disable-next-line:eofline
}

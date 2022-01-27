import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PillsInventoryComponent } from '../../views/pills_inventory/pills_inventory.component';
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
      {
        path: 'pills_inventory',
        component: PillsInventoryComponent,
        data: {
          title: 'Pastillas'
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

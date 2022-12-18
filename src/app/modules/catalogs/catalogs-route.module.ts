import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatPackageComponent } from '../../views/cat_packages/cat_package.component';
import { CatProductsComponent } from '../../views/cat_products/cat_products.component';
import { CatReferencesComponent } from '../../views/cat_references/cat_references.component';
import { CatServicesComponent } from '../../views/cat_services/cat_services.component';
import { DepartmentsComponent } from '../../views/departments/departments.component';
import { CatExpensesComponent } from '../../views/cat_expenses/cat_expenses.component';
import { CatConceptsComponent } from '../../views/cat_concepts/cat_concepts.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Catalogos'
    },
    children: [
      {
        path: 'cat_packages',
        component: CatPackageComponent,
        data: {
          title: 'Paquetes'
        }
      },
      {
        path: 'cat_products',
        component: CatProductsComponent,
        data: {
          title: 'Productos'
        }
      },
      {
        path: 'cat_references',
        component: CatReferencesComponent,
        data: {
          title: 'Referencias'
        }
      },
      {
        path: 'cat_services',
        component: CatServicesComponent,
        data: {
          title: 'Servicios'
        }
      },
      {
        path: 'cat_expenses',
        component: CatExpensesComponent,
        data: {
          title: 'Tipo de gastos'
        }
      },
      {
        path: 'cat_concepts',
        component: CatConceptsComponent,
        data: {
          title: 'Conceptos'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule {}

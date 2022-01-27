import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlwaysAuthGuard } from './aunth/AlwaysAuthGuard';

import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

import { BaseModule } from './modules/base/base.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { AdminModule } from './modules/admin/admin.module';
import { CatalogsModule } from './modules/catalogs/catalogs.module';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Pagina 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Pagina 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Inicio de sesión'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Pagina de registro'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AlwaysAuthGuard],
    canActivateChild: [AlwaysAuthGuard],
    data: {
      title: 'FASE2SPA'
    },
    children: [
      {
        path: 'page',
        loadChildren: './modules/base/base.module#BaseModule',
        data: {
          title: 'Principal'
        }
      },
      {
        path: 'shopping',
        loadChildren: './modules/purchases/purchases.module#PurchasesModule',
        data: {
          title: 'Compras'
        }
      },
      {
        path: 'admin',
        loadChildren:  './modules/admin/admin.module#AdminModule',
        data: {
          title: 'Administración'
        }
      },
      {
        path: 'catalog',
        loadChildren:  './modules/catalogs/catalogs.module#CatalogsModule',
        data: {
          title: 'Catalogos'
        }
      },
      {
        path: 'inventory',
        loadChildren:  './modules/inventory/inventory.module#InventoryModule',
        data: {
          title: 'Inventario'
        }
      }
    ]
  },
  {
    path: '**',
    pathMatch:'full',
    redirectTo:'404'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

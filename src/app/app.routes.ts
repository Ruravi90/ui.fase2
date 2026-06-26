import { Routes } from '@angular/router';
import { AlwaysAuthGuard } from './aunth/AlwaysAuthGuard';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: { title: 'Pagina 404' }
  },
  {
    path: '500',
    component: P500Component,
    data: { title: 'Pagina 500' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Inicio de sesión' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Pagina de registro' }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AlwaysAuthGuard],
    canActivateChild: [AlwaysAuthGuard],
    data: { title: 'FASE2SPA' },
    children: [
      {
        path: 'page',
        loadChildren: () => import('./modules/base/base.module').then(m => m.BaseModule),
        data: { title: 'Principal' }
      },
      {
        path: 'shopping',
        loadChildren: () => import('./modules/purchases/purchases.module').then(m => m.PurchasesModule),
        data: { title: 'Compras' }
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
        data: { title: 'Administración' }
      },
      {
        path: 'catalog',
        loadChildren: () => import('./modules/catalogs/catalogs.module').then(m => m.CatalogsModule),
        data: { title: 'Catalogos' }
      },
      {
        path: 'inventory',
        loadChildren: () => import('./modules/inventory/inventory.module').then(m => m.InventoryModule),
        data: { title: 'Inventario' }
      },
      {
        path: 'saas',
        loadChildren: () => import('./modules/saas/saas.module').then(m => m.SaasModule),
        data: { title: 'Administración SaaS' }
      }
    ]
  },
  {
    path: '**',
    pathMatch:'full',
    redirectTo:'404'
  }
];

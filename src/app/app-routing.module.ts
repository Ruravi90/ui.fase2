import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule,TitleStrategy, RouterStateSnapshot } from '@angular/router';
import {Title} from "@angular/platform-browser";

import { AlwaysAuthGuard } from './aunth/AlwaysAuthGuard';

import { DefaultLayoutComponent } from './containers';

import { P404Component } from ".//views/error/404.component"
import { P500Component } from './/views/error/500.component';
import { LoginComponent } from './/views/login/login.component';
import { RegisterComponent } from './/views/register/register.component';

@Injectable({providedIn: 'root'})
export class MyTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`Fase 2 | ${title}`);
    }
  }
}


const routes: Routes = [
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
        loadChildren: () =>
          import('.//modules/base/base.module').then((m) => m.BaseModule),
        data: {
          title: 'Principal'
        }
      },
      {
        path: 'shopping',
        loadChildren: () =>
          import('.//modules/purchases/purchases.module').then((m) => m.PurchasesModule),
        data: {
          title: 'Compras'
        }
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('.//modules/admin/admin.module').then((m) => m.AdminModule),
        data: {
          title: 'Administración'
        }
      },
      {
        path: 'catalog',
        loadChildren: () =>
          import('.//modules/catalogs/catalogs.module').then((m) => m.CatalogsModule),
        data: {
          title: 'Catalogos'
        }
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('.//modules/inventory/inventory.module').then((m) => m.InventoryModule),
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
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule],
  providers: [
    {provide: TitleStrategy, useClass: MyTitleStrategy},
  ]
})
export class AppRoutingModule {
}

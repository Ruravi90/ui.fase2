//import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeMx from '@angular/common/locales/es-MX';
import localeMxExtra from '@angular/common/locales/extra/es-MX';

registerLocaleData(localeMx, 'es-MX', localeMxExtra);

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { NgxSpinnerModule } from 'ngx-spinner';
import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

import { AlwaysAuthGuard } from './aunth/AlwaysAuthGuard';
import { TokenInterceptor } from './aunth/token.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgDatepickerModule } from 'ng2-datepicker';
import { OrderModule } from 'ngx-order-pipe';
import { PaginationModule } from 'ngx-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';


// Import Services
import { ClientService,
  TypeService,
  QzTrayService,
  DepartmentService,
  AgentService,
  UserService,
  SaleService,
  RoleService,
  PermissionService,
  PackageService,
  PaymentService,
  PackageTrackingService,
  CreditorService,
  PillsInventoryService,
  ProductsInventaryService,
  BalanceService,
  PurchaseService,
  PaginateService
} from './services';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    NgSelectModule,
    NgDatepickerModule,
    NgxSpinnerModule,
    OrderModule,
    NgxChartsModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
  ],
  providers: [
    ClientService,
    TypeService,
    QzTrayService,
    DepartmentService,
    AgentService,
    SaleService,
    UserService,
    RoleService,
    PermissionService,
    PackageService,
    PaymentService,
    PackageTrackingService,
    CreditorService,
    PillsInventoryService,
    ProductsInventaryService,
    BalanceService,
    PurchaseService,
    AlwaysAuthGuard,
    PaginateService,
    httpInterceptorProviders,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';


import { AlwaysAuthGuard } from './aunth/AlwaysAuthGuard';
import { TokenInterceptor } from './aunth/token.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

// Import Services
import { ClientService,
  TypeService,
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

const APP_Services = [
  ClientService,
  TypeService,
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
];




// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
} from '@coreui/angular';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DatepickerModule } from 'ng2-datepicker';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ...APP_CONTAINERS
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    PerfectScrollbarModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    SweetAlert2Module.forRoot(),
    DatepickerModule
  ],
  providers: [
    APP_Services,
    AlwaysAuthGuard,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    httpInterceptorProviders,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    Title
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

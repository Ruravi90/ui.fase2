// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatepickerModule } from 'ng2-datepicker';

import { BaseRoutingModule } from './base-route.module';
import { DashboardComponent } from '../../views/dashboard/dashboard.component';
import { ClientsComponent } from '../../views/clients/clients.component';
import { SaleComponent } from '../../views/sale/sale.component';
import { SalesComponent } from '../../views/sales/sales.component';
import { PackagesComponent } from '../../views/packages/packages.component';
import { BoxComponent } from '../../views/box/box.component';



@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule,
    DatepickerModule
  ],
  declarations: [
    DashboardComponent,
    ClientsComponent,
    SaleComponent,
    PackagesComponent,
    BoxComponent,
    SalesComponent
  ]
})
export class BaseModule { }

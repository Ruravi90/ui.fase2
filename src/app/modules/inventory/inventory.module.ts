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
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatepickerModule } from 'ng2-datepicker';
import { OrderModule } from 'ngx-order-pipe';

import { InventoryRoutingModule } from './inventory-route.module';
import { ProductsInventoryComponent } from '../../views/products_inventory/products_inventory.component';



@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    InventoryRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule,
    DatepickerModule,
    OrderModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    ProductsInventoryComponent,
  ]
})
export class InventoryModule { }

// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
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
import { NgDatepickerModule } from 'ng2-datepicker';
import { OrderModule } from 'ngx-order-pipe';

import { InventoryRoutingModule } from './inventory-route.module';
import { PillsInventoryComponent } from '../../views/pills_inventory/pills_inventory.component';
import { ProductsInventoryComponent } from '../../views/products_inventory/products_inventory.component';



@NgModule({
  imports: [
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
    NgDatepickerModule,
    OrderModule
  ],
  declarations: [
    PillsInventoryComponent,
    ProductsInventoryComponent,
  ]
})
export class InventoryModule { }

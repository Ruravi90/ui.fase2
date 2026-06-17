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


import { InventoryRoutingModule } from './inventory-route.module';
import { PillsInventoryComponent } from '../../views/pills_inventory/pills_inventory.component';
import { ProductsInventoryComponent } from '../../views/products_inventory/products_inventory.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InventoryRoutingModule,
    BsDropdownModule,
    TabsModule,
    CarouselModule,
    CollapseModule,
    PaginationModule,
    PopoverModule,
    ProgressbarModule,
    TooltipModule,
    NgSelectModule,
    ProductsInventoryComponent,
    PillsInventoryComponent
  ],
  declarations: [
  ]
})
export class InventoryModule { }

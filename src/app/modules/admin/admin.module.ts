// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
// Carousel Component
import { CarouselModule } from 'ngx-bootstrap/carousel';
// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';
// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// Select Componen
import { NgSelectModule } from '@ng-select/ng-select';

import { AdminRoutingModule } from './admin-route.module';
import { UserComponent } from '../../views/users/user.component';
import { AgentComponent } from '../../views/agents/agent.component';
import { DepartmentsComponent } from '../../views/departments/departments.component';
import { CreditorsComponent } from '../../views/creditors/creditors.component';
import { RolesComponent } from '../../views/roles/roles.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule
  ],
  declarations: [
    UserComponent,
    AgentComponent,
    DepartmentsComponent,
    CreditorsComponent,
    RolesComponent
  ]
})
export class AdminModule { }

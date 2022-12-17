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
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';

// Components
import { CatalogsRoutingModule } from './catalogs-route.module';
import { CatPackageComponent } from '../../views/cat_packages/cat_package.component';
import { CatProductsComponent } from '../../views/cat_products/cat_products.component';
import { CatReferencesComponent } from '../../views/cat_references/cat_references.component';
import { CatServicesComponent } from '../../views/cat_services/cat_services.component';
import { CatExpensesComponent } from '../../views/cat_expenses/cat_expenses.component';
import { CatConceptsComponent } from '../../views/cat_concepts/cat_concepts.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CatalogsRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    CatPackageComponent,
    CatProductsComponent,
    CatReferencesComponent,
    CatServicesComponent,
    CatExpensesComponent,
    CatConceptsComponent
  ]
})
export class CatalogsModule { }

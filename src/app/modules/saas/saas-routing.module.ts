import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../views/saas/dashboard/dashboard.component';
import { TenantsComponent } from '../../views/saas/tenants/tenants.component';
import { PlansComponent } from '../../views/saas/plans/plans.component';
import { SubscriptionsComponent } from '../../views/saas/subscriptions/subscriptions.component';
import { PromoCodesComponent } from '../../views/saas/promo-codes/promo-codes.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tenants', component: TenantsComponent },
  { path: 'plans', component: PlansComponent },
  { path: 'subscriptions', component: SubscriptionsComponent },
  { path: 'promo-codes', component: PromoCodesComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaasRoutingModule { }

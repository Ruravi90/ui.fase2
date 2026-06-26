import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { TenantService } from '../services/tenant.service';

@Directive({
  selector: '[appHasFeature]',
  standalone: true
})
export class HasFeatureDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tenantService: TenantService
  ) { }

  @Input() set appHasFeature(featureCode: string) {
    if (this.tenantService.hasFeature(featureCode) && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!this.tenantService.hasFeature(featureCode) && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  // Mocked features for now. This should be loaded from the backend API on login.
  private currentFeatures: string[] = ['module-sales'];

  constructor() { }

  public hasFeature(featureCode: string): boolean {
    return this.currentFeatures.includes(featureCode);
  }

  public getFeatures(): string[] {
    return this.currentFeatures;
  }

  public updateFeatures(features: string[]): void {
    this.currentFeatures = features;
  }
}

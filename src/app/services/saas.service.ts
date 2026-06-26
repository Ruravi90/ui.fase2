import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaasService {
  private apiUrl = environment.urlApi + 'saas';

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  // Suscripciones
  getSubscriptions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/subscriptions`);
  }

  // Tenants
  getTenants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tenants`);
  }

  createTenant(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tenants`, data);
  }

  updateTenant(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tenants/${id}`, data);
  }

  deleteTenant(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tenants/${id}`);
  }

  assignManualPlan(tenantId: string, planId: number, months: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tenants/${tenantId}/assign-plan`, { plan_id: planId, months });
  }

  // Plans
  getPlans(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/plans`);
  }

  createPlan(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/plans`, data);
  }

  updatePlan(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/plans/${id}`, data);
  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/plans/${id}`);
  }
}

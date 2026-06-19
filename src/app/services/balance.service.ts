import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Balance } from '../models';

@Injectable({ providedIn: 'root' })
export class BalanceService {
    private url: string = environment.urlApi + 'box';
    constructor(private http: HttpClient) {
    }
    public get(filter:any): Observable<Balance[]> {
      return this.http.post<Balance[]>(this.url + '/balance',{date: filter.date});
    }
    public getSaleChart(): Observable<any> {
    return this.http.post<any>(this.url + '/sales_chart',{});
    }
    public getPackageChart(): Observable<any> {
        return this.http.post<any>(this.url + '/sales_package',{});
    }
    public getServiceChart(): Observable<any> {
        return this.http.post<any>(this.url + '/sales_service',{});
    }
    public getDashboardSummary(): Observable<any> {
        return this.http.post<any>(this.url + '/dashboard_summary', {});
    }
    public getDepartmentChart(): Observable<any> {
        return this.http.post<any>(this.url + '/sales_department', {});
    }
    public getPaymentMethodsChart(): Observable<any> {
        return this.http.post<any>(this.url + '/payment_methods', {});
    }
    public getTopSellers(): Observable<any> {
        return this.http.post<any>(this.url + '/top_sellers', {});
    }
    public getRecentActivity(page: number = 1, perPage: number = 8): Observable<any> {
        return this.http.get<any>(this.url + `/recent_activity?page=${page}&per_page=${perPage}`);
    }
    public getAlerts(): Observable<any> {
        return this.http.get<any>(this.url + '/alerts');
    }
}

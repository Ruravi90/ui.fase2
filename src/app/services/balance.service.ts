import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Balance, User } from '../models';

@Injectable()
export class BalanceService {
    private url: string = environment.urlApi + 'box';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
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
}

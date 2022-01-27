import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Payment, User } from '../models';

@Injectable()
export class PaymentService {
    private url: string = environment.urlApi + 'payments';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    get(): Observable<Payment[]> {
        return this.http.get<Payment[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<Payment> {
        return this.http.get<Payment>(this.url + '/' + id)
        .map(r => r);
    }
    geForSales(id: number): Observable<Payment[]> {
        return this.http.get<Payment[]>(this.url + '/for_sale/' + id)
        .map(r => r);
    }
    post(model: Payment): Observable<any> {
      return this.http.post<any>(this.url, model).map(r => r);
    }
    put(model: Payment): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

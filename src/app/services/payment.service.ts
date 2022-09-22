import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Payment, User } from '../models';

@Injectable()
export class PaymentService {
    private url: string = environment.urlApi + 'payments';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    }
    get(): Observable<Payment[]> {
        return this.http.get<Payment[]>(this.url).pipe(map((r:any)=> r));
    }
    getById(id: number): Observable<Payment> {
        return this.http.get<Payment>(this.url + '/' + id)
        .pipe(map((r:any)=> r));
    }
    geForSales(id: number): Observable<Payment[]> {
        return this.http.get<Payment[]>(this.url + '/for_sale/' + id)
        .pipe(map((r:any)=> r));
    }
    post(model: Payment): Observable<any> {
      return this.http.post<any>(this.url, model).pipe(map((r:any)=> r));
    }
    put(model: Payment): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).pipe(map((r:any)=> r));
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
}

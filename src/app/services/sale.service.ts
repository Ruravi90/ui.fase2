import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sale, User, Paginate} from '../models';

@Injectable()
export class SaleService {
    private url: string = environment.urlApi + 'sales';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}' || '{}');
    }
    get(): Observable<Sale[]> {
        return this.http.get<Sale[]>(this.url);
    }
    getById(id: number): Observable<Sale> {
        return this.http.get<Sale>(this.url + '/' + id);
    }
    getForDay(): Observable<Sale[]> {
        return this.http.get<Sale[]>(this.url + '/sales_day');
    }
    getSalesUserDay(): Observable<Sale[]> {
      return this.http.get<Sale[]>(this.url + '/user/' + this.currentUser.id);
    }
    getCuteSales(): Observable<Sale[]> {
        return this.http.post<Sale[]>(this.url + '/cute_now', { user_id:  this.currentUser.id });
    }
    getCuteDay(date:string): Observable<Sale[]> {
      return this.http.post<Sale[]>(this.url + '/cute_day', { date:  date });
    }
    post(models: Sale[]): Observable<any> {
      return this.http.post<any>(this.url, { sales: models });
    }
    put(model: Sale): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model );
    }
    cancel(id: number): Observable<any> {
      return this.http.post<any>(this.url + '/cancel/' + id,{ user_id:  this.currentUser.id });
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id);
    }
}

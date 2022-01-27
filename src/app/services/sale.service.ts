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
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    get(): Observable<Sale[]> {
        return this.http.get<Sale[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<Sale> {
        return this.http.get<Sale>(this.url + '/' + id).map(r => r);
    }
    getForDay(): Observable<Sale[]> {
        return this.http.get<Sale[]>(this.url + '/sales_day').map(r => r);
    }
    getSalesUserDay(): Observable<Sale[]> {
      return this.http.get<Sale[]>(this.url + '/user/' + this.currentUser.id).map(r => r);
    }
    getCuteSales(): Observable<Sale[]> {
        return this.http.post<Sale[]>(this.url + '/cute_now', { user_id:  this.currentUser.id }).map(r => r);
    }
    getCuteDay(date:string): Observable<Sale[]> {
      return this.http.post<Sale[]>(this.url + '/cute_day', { date:  date }).map(r => r);
    }
    post(models: Sale[]): Observable<any> {
      return this.http.post<any>(this.url, { sales: models }).map(r => r);
    }
    put(model: Sale): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).map(r => r);
    }
    cancel(id: number): Observable<any> {
      return this.http.post<any>(this.url + '/cancel/' + id,{ user_id:  this.currentUser.id }).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

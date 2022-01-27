import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Purchase, User, Paginate} from '../models';

@Injectable()
export class PurchaseService {
    private url: string = environment.urlApi + 'purchases';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    paginate(filter: any): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate',filter).map(r => r);
    }
    getForUrl(page: number, perPage: number): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate?page=' + page, { per_page: perPage}).map(r => r);
    }
    get(): Observable<Purchase[]> {
        return this.http.get<Purchase[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<Purchase> {
        return this.http.get<Purchase>(this.url + '/' + id).map(r => r);
    }
    post(models: Purchase[]): Observable<any> {
      return this.http.post<any>(this.url, { purchases: models }).map(r => r);
    }
    put(model: Purchase): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model).map(r => r);
    }
    pay(model: Purchase): Observable<any> {
      return this.http.post<any>(this.url + '/pay/' + model.id, { is_paid: 1 }).map(r => r);
    }
    cancel(id: number): Observable<any> {
      return this.http.post<any>(this.url + '/cancel/' + id,{ user_id:  this.currentUser.id }).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

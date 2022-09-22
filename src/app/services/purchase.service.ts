import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Purchase, User, Paginate} from '../models';

@Injectable()
export class PurchaseService {
    private url: string = environment.urlApi + 'purchases';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    }
    paginate(filter: any): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate',filter).pipe(map((r:any)=> r));
    }
    getForUrl(page: number, perPage: number): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate?page=' + page, { per_page: perPage}).pipe(map((r:any)=> r));
    }
    get(): Observable<Purchase[]> {
        return this.http.get<Purchase[]>(this.url).pipe(map((r:any)=> r));
    }
    getById(id: number): Observable<Purchase> {
        return this.http.get<Purchase>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
    post(models: Purchase[]): Observable<any> {
      return this.http.post<any>(this.url, { purchases: models }).pipe(map((r:any)=> r));
    }
    put(model: Purchase): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model).pipe(map((r:any)=> r));
    }
    pay(model: Purchase): Observable<any> {
      return this.http.post<any>(this.url + '/pay/' + model.id, { is_paid: 1 }).pipe(map((r:any)=> r));
    }
    cancel(id: number): Observable<any> {
      return this.http.post<any>(this.url + '/cancel/' + id,{ user_id:  this.currentUser.id }).pipe(map((r:any)=> r));
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
}

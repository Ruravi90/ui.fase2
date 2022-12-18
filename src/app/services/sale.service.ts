import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sale, User, Paginate} from '../models';

@Injectable()
export class SaleService {
    private url: string = environment.urlApi + 'sales';
    private currentUser;
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    }
    get(): Observable<Sale[]> {
        return this.http.get<Sale[]>(this.url).pipe(map((r:any)=> r));
    }
    getById(id: number): Observable<Sale> {
        return this.http.get<Sale>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
    getForDay(): Observable<Sale[]> {
        return this.http.get<Sale[]>(this.url + '/sales_day').pipe(map((r:any)=> r));
    }
    getSalesUserDay(): Observable<Sale[]> {
      return this.http.get<Sale[]>(this.url + '/user/' + this.currentUser.claims.id).pipe(map((r:any)=> r));
    }
    getCuteSales(): Observable<Sale[]> {
        return this.http.post<Sale[]>(this.url + '/cute_now', { user_id:  this.currentUser.claims.id }).pipe(map((r:any)=> r));
    }
    getCuteDay(date:string): Observable<Sale[]> {
      return this.http.post<Sale[]>(this.url + '/cute_day', { date:  date }).pipe(map((r:any)=> r));
    }
    post(models: Sale[]): Observable<any> {
      return this.http.post<any>(this.url, { sales: models }).pipe(map((r:any)=> r));
    }
    put(model: Sale): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).pipe(map((r:any)=> r));
    }
    cancel(id: number): Observable<any> {
      return this.http.post<any>(this.url + '/cancel/' + id,{ user_id:  this.currentUser.claims.id }).pipe(map((r:any)=> r));
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
}

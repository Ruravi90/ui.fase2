import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Creditor, User } from '../models';

@Injectable()
export class CreditorService {
    private url: string = environment.urlApi + 'providers';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    }
    get(): Observable<Creditor[]> {
        return this.http.get<Creditor[]>(this.url).pipe(map((r:any)=> r));
    }
    getById(id: number): Observable<Creditor> {
        return this.http.get<Creditor>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
    post(model: Creditor): Observable<any> {
      return this.http.post<any>(this.url, model).pipe(map((r:any)=> r));
    }
    put(model: Creditor): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).pipe(map((r:any)=> r));
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
}

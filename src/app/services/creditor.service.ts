import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Creditor, User } from '../models';

@Injectable()
export class CreditorService {
    private url: string = environment.urlApi + 'providers';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    get(): Observable<Creditor[]> {
        return this.http.get<Creditor[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<Creditor> {
        return this.http.get<Creditor>(this.url + '/' + id).map(r => r);
    }
    post(model: Creditor): Observable<any> {
      return this.http.post<any>(this.url, model).map(r => r);
    }
    put(model: Creditor): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

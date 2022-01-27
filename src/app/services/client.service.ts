import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client, User, Paginate } from '../models';

@Injectable()
export class ClientService {
    private url: string = environment.urlApi + 'clients';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    paginate(perPage: number,shared: string = ''): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate', { per_page: perPage, shared: shared }).map(r => r);
    }
    getForUrl(page: number, perPage: number): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate?page=' + page, { per_page: perPage}).map(r => r);
    }
    get(): Observable<Client[]> {
        return this.http.get<Client[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<Client> {
        return this.http.get<Client>(this.url + '/' + id).map(r => r);
    }
    prevPage(url: string): Observable<any> {
        return this.http.get<Client>(url).map(r => r);
    }
    nexPage(url: string): Observable<any> {
        return this.http.get<Client>(url).map(r => r);
    }
    toPage(url: string): Observable<any> {
        return this.http.get<any>(url).map(r => r);
    }
    post(model: Client): Observable<any> {
      return this.http.post<any>(this.url, model).map(r => r);
    }
    put(model: Client): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

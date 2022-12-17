import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client, User, Paginate } from '../models';

@Injectable()
export class ClientService {
    private url: string = environment.urlApi + 'clients';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
      let user = localStorage.getItem('currentUser');
      this.currentUser = JSON.parse(user!);
    }
    paginate(perPage: number,shared: string = ''): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate', { per_page: perPage, shared: shared }).pipe(map((r:any)=> r));
    }
    getForUrl(page: number, perPage: number): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate?page=' + page, { per_page: perPage}).pipe(map((r:any)=> r));
    }
    get(): Observable<Client[]> {
        return this.http.get<Client[]>(this.url).pipe(map((r:any)=> r));
    }
    getById(id: number): Observable<Client> {
        return this.http.get<Client>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
    prevPage(url: string): Observable<any> {
        return this.http.get<Client>(url).pipe(map((r:any)=> r));
    }
    nexPage(url: string): Observable<any> {
        return this.http.get<Client>(url).pipe(map((r:any)=> r));
    }
    toPage(url: string): Observable<any> {
        return this.http.get<any>(url).pipe(map((r:any)=> r));
    }
    post(model: Client): Observable<any> {
      return this.http.post<any>(this.url, model).pipe(map((r:any)=> r));
    }
    put(model: Client): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model).pipe(map((r:any)=> r));
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
}

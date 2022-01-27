import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role, User } from '../models';

@Injectable()
export class RoleService {
    private url: string = environment.urlApi + 'roles';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    get(): Observable<Role[]> {
        return this.http.get<Role[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<Role> {
        return this.http.get<Role>(this.url + '/' + id).map(r => r);
    }
    post(model: Role): Observable<any> {
      return this.http.post<any>(this.url, model).map(r => r);
    }
    put(model: Role): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

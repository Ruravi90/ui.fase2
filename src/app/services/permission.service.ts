import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Permission, User } from '../models';

@Injectable()
export class PermissionService {
    private url: string = environment.urlApi + 'permissions';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    get(): Observable<Permission[]> {
        return this.http.get<Permission[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<Permission> {
        return this.http.get<Permission>(this.url + '/' + id).map(r => r);
    }
    post(model: Permission): Observable<any> {
      return this.http.post<any>(this.url, model).map(r => r);
    }
    put(model: Permission): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

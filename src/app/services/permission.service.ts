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
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    get(): Observable<Permission[]> {
        return this.http.get<Permission[]>(this.url);
    }
    getById(id: number): Observable<Permission> {
        return this.http.get<Permission>(this.url + '/' + id);
    }
    post(model: Permission): Observable<any> {
      return this.http.post<any>(this.url, model);
    }
    put(model: Permission): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model );
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id);
    }
}

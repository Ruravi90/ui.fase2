import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../models';

@Injectable({ providedIn: 'root' })
export class RoleService {
    private url: string = environment.urlApi + 'roles';
    constructor(private http: HttpClient) {
    }
    get(): Observable<Role[]> {
        return this.http.get<Role[]>(this.url);
    }
    getById(id: number): Observable<Role> {
        return this.http.get<Role>(this.url + '/' + id);
    }
    post(model: Role): Observable<any> {
      return this.http.post<any>(this.url, model);
    }
    put(model: Role): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model );
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id);
    }
}

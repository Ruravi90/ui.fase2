import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role, User } from '../models';

@Injectable()
export class RoleService {
    private url: string = environment.urlApi + 'roles';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    }
    get(): Observable<Role[]> {
        return this.http.get<Role[]>(this.url).pipe(map((r:any)=> r));
    }
    getById(id: number): Observable<Role> {
        return this.http.get<Role>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
    post(model: Role): Observable<any> {
      return this.http.post<any>(this.url, model).pipe(map((r:any)=> r));
    }
    put(model: Role): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).pipe(map((r:any)=> r));
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Department, User } from '../models';

@Injectable()
export class DepartmentService {
    private url: string = environment.urlApi + 'departments';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    }
    get(): Observable<Department[]> {
        return this.http.get<Department[]>(this.url).pipe(map((r:any)=> r));
    }
    getById(id: number): Observable<Department> {
        return this.http.get<Department>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
    post(model: Department): Observable<any> {
      return this.http.post<any>(this.url, model).pipe(map((r:any)=> r));
    }
    put(model: Department): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).pipe(map((r:any)=> r));
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
}

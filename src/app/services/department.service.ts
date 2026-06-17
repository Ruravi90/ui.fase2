import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Department, User } from '../models';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private url: string = environment.urlApi + 'departments';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    get(): Observable<Department[]> {
        return this.http.get<Department[]>(this.url);
    }
    getById(id: number): Observable<Department> {
        return this.http.get<Department>(this.url + '/' + id);
    }
    post(model: Department): Observable<any> {
      return this.http.post<any>(this.url, model);
    }
    put(model: Department): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model );
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id);
    }
}

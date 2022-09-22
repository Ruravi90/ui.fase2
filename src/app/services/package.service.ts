import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Package, User } from '../models';

@Injectable()
export class PackageService {
    private url: string = environment.urlApi + 'packages';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    }
    get(): Observable<Package[]> {
        return this.http.get<Package[]>(this.url).pipe(map((r:any)=> r));
    }
    getById(id: number): Observable<Package> {
        return this.http.get(this.url + '/' + id).pipe(map((r:any)=> r));
    }
    getFilters(filter: any): Observable<Package[]> {
        return this.http.post<Package[]>(this.url + '/is_completed', filter ).pipe(map((r:any)=> r));
    }
    post(model: Package): Observable<any> {
      return this.http.post<any>(this.url, model).pipe(map((r:any)=> r));
    }
    put(model: Package): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).pipe(map((r:any)=> r));
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
}

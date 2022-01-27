import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Package, User } from '../models';

@Injectable()
export class PackageService {
    private url: string = environment.urlApi + 'packages';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    get(): Observable<Package[]> {
        return this.http.get<Package[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<Package> {
        return this.http.get(this.url + '/' + id).map(r => r);
    }
    getFilters(filter: any): Observable<Package[]> {
        return this.http.post<Package[]>(this.url + '/is_completed', filter ).map(r => r);
    }
    post(model: Package): Observable<any> {
      return this.http.post<any>(this.url, model).map(r => r);
    }
    put(model: Package): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

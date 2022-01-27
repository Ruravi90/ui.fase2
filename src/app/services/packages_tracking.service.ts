import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PackageTracking, User } from '../models';

@Injectable()
export class PackageTrackingService {
    private url: string = environment.urlApi + 'packages_tracking';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    get(): Observable<PackageTracking[]> {
        return this.http.get<PackageTracking[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<PackageTracking> {
        return this.http.get<PackageTracking>(this.url + '/' + id).map(r => r);
    }
    geForPackage(id: number): Observable<PackageTracking[]> {
        return this.http.get<PackageTracking[]>(this.url + '/for_package/' + id).map(r => r);
    }
    post(model: PackageTracking): Observable<any> {
      return this.http.post<any>(this.url, model).map(r => r);
    }
    put(model: PackageTracking): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

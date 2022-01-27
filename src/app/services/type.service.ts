import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { _Type, User, Paginate } from '../models';

@Injectable()
export class TypeService {
  private url: string = environment.urlApi;
  private currentUser: User = new User();
  constructor(private http: HttpClient) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  paginate(nameModel: string,filter: any): Observable<Paginate> {
    return this.http.post<Paginate>(this.url + nameModel + '/paginate',filter).map(r => r);
  }
  getForUrl(nameModel: string,page: number, filter: any): Observable<Paginate> {
    return this.http.post<Paginate>(this.url + nameModel + '/paginate?page=' + page, filter).map(r => r);
  }
  getAll(nameModel: string): Observable<_Type[]> {
      return this.http.get<_Type[]>(this.url + nameModel).map(r => r);
  }
  getById(nameModel: string, id: number): Observable<_Type> {
    return this.http.get<_Type>(this.url + nameModel + '/' + id).map(r => r);
  }
  getAllWhitOthers(nameModel: string): Observable<_Type[]> {
    return this.http.get<_Type[]>(this.url + nameModel).map(r => {
        r.push({id: -1, name: 'Otro'});
        return r;
    });
  }
  post(nameModel: string, models: _Type): Observable<any> {
    return this.http.post<any>(this.url + nameModel, models).map(r => r);
  }
  put(nameModel: string, model: _Type): Observable<any> {
    return this.http.put<any>(this.url + nameModel + '/' + model.id, model).map(r => r);
  }
  delete(nameModel: string, id: number): Observable<any> {
    return this.http.delete<any>(this.url + nameModel + '/' + id).map(r => r);
  }
}

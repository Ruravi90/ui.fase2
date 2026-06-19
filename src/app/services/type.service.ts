import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { _Type, Paginate } from '../models';

@Injectable({ providedIn: 'root' })
export class TypeService {
  private url: string = environment.urlApi;
  constructor(private http: HttpClient) {
  }
  paginate(nameModel: string,filter: any): Observable<Paginate> {
    return this.http.post<Paginate>(this.url + nameModel + '/paginate',filter);
  }
  getForUrl(nameModel: string,page: number, filter: any): Observable<Paginate> {
    return this.http.post<Paginate>(this.url + nameModel + '/paginate?page=' + page, filter);
  }
  getAll(nameModel: string): Observable<_Type[]> {
      return this.http.get<_Type[]>(this.url + nameModel);
  }
  getById(nameModel: string, id: number): Observable<_Type> {
    return this.http.get<_Type>(this.url + nameModel + '/' + id);
  }
  getAllWhitOthers(nameModel: string): Observable<_Type[]> {
    return this.http.get<_Type[]>(this.url + nameModel).pipe(map(r => {
        r.push({id: -1, name: 'Otro'});
        return r;
    }));
  }
  post(nameModel: string, models: _Type): Observable<any> {
    return this.http.post<any>(this.url + nameModel, models);
  }
  put(nameModel: string, model: _Type): Observable<any> {
    return this.http.put<any>(this.url + nameModel + '/' + model.id, model);
  }
  delete(nameModel: string, id: number): Observable<any> {
    return this.http.delete<any>(this.url + nameModel + '/' + id);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { _Type, User, Paginate } from '../models';

@Injectable()
export class TypeService {
  private url: string = environment.urlApi;
  private currentUser: User = new User();
  constructor(private http: HttpClient) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  }
  paginate(nameModel: string,filter: any): Observable<Paginate> {
    return this.http.post<Paginate>(this.url + nameModel + '/paginate',filter).pipe(map((r:any)=> r));
  }
  getForUrl(nameModel: string,page: number, filter: any): Observable<Paginate> {
    return this.http.post<Paginate>(this.url + nameModel + '/paginate?page=' + page, filter).pipe(map((r:any)=> r));
  }
  getAll(nameModel: string): Observable<_Type[]> {
      return this.http.get<_Type[]>(this.url + nameModel).pipe(map((r:any)=> r));
  }
  getById(nameModel: string, id: number): Observable<_Type> {
    return this.http.get<_Type>(this.url + nameModel + '/' + id).pipe(map((r:any)=> r));
  }
  getAllWhitOthers(nameModel: string): Observable<_Type[]> {
    return this.http.get<_Type[]>(this.url + nameModel).pipe(map(r => {
        r.push({id: -1, name: 'Otro'});
        return r;
    }));
  }
  post(nameModel: string, models: _Type): Observable<any> {
    return this.http.post<any>(this.url + nameModel, models).pipe(map((r:any)=> r));
  }
  put(nameModel: string, model: _Type): Observable<any> {
    return this.http.put<any>(this.url + nameModel + '/' + model.id, model).pipe(map((r:any)=> r));
  }
  delete(nameModel: string, id: number): Observable<any> {
    return this.http.delete<any>(this.url + nameModel + '/' + id).pipe(map((r:any)=> r));
  }
}

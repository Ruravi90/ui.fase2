import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Inventory, User } from '../models';

@Injectable()
export class ProductsInventaryService {
  private url: string = environment.urlApi + 'products_inventory';
  private currentUser: User = new User();
  constructor(private http: HttpClient) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  }
  public getAll(): Observable<Inventory[]> {
      return this.http.get<Inventory[]>(this.url).pipe(map((r:any)=> r));
  }
  getById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(this.url + '/' + id).pipe(map((r:any)=> r));
  }
  getForProduct(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(this.url + '/product/' + id).pipe(map((r:any)=> r));
  }
  post(models: Inventory): Observable<any> {
    return this.http.post<any>(this.url, models).pipe(map((r:any)=> r));
  }
  put(model: Inventory): Observable<any> {
    return this.http.put<any>(this.url + '/' + model.id, model ).pipe(map((r:any)=> r));
  }
  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
  }
}

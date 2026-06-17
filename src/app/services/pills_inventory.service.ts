import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Inventory, User } from '../models';

@Injectable({ providedIn: 'root' })
export class PillsInventoryService {
  private url: string =  environment.urlApi + 'pills_inventory';
  private currentUser: User = new User();
  constructor(private http: HttpClient) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
  public getAll(): Observable<Inventory[]> {
      return this.http.get<Inventory[]>(this.url);
  }
  getById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(this.url + '/' + id);
  }
  getForPill(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(this.url + '/pill/' + id);
  }
  post(models: Inventory): Observable<any> {
    return this.http.post<any>(this.url, models);
  }
  put(model: Inventory): Observable<any> {
    return this.http.put<any>(this.url + '/' + model.id, model );
  }
  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + id);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Purchase, Paginate} from '../models';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
    private url: string = environment.urlApi + 'purchases';
    constructor(private http: HttpClient, private userService: UserService) {
    }
    private get currentUser() {
        return this.userService.currentUser;
    }
    paginate(filter: any): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate',filter);
    }
    getForUrl(page: number, perPage: number): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + '/paginate?page=' + page, { per_page: perPage});
    }
    get(): Observable<Purchase[]> {
        return this.http.get<Purchase[]>(this.url);
    }
    getById(id: number): Observable<Purchase> {
        return this.http.get<Purchase>(this.url + '/' + id);
    }
    post(models: Purchase[]): Observable<any> {
      return this.http.post<any>(this.url, { purchases: models });
    }
    put(model: Purchase): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model);
    }
    pay(model: Purchase): Observable<any> {
      return this.http.post<any>(this.url + '/pay/' + model.id, { is_paid: 1 });
    }
    cancel(id: number): Observable<any> {
      return this.http.post<any>(this.url + '/cancel/' + id,{ user_id:  this.currentUser.id });
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id);
    }
}

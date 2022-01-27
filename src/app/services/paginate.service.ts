import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sale, User, Paginate} from '../models';

@Injectable()
export class PaginateService {
    private url: string = environment.urlApi;
    public model: string;
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    paginate(filter: any): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + this.model + '/paginate', filter).map(r => r);
    }
    getForUrl(page: number, filter: any): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + this.model + '/paginate?page=' + page, filter).map(r => r);
    }
}

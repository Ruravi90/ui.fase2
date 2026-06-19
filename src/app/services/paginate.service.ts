import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sale, Paginate} from '../models';

@Injectable({ providedIn: 'root' })
export class PaginateService {
    private url: string = environment.urlApi;
    public model: string = '';
    constructor(private http: HttpClient) {
    }
    paginate(filter: any): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + this.model + '/paginate', filter);
    }
    getForUrl(page: number, filter: any): Observable<Paginate> {
      return this.http.post<Paginate>(this.url + this.model + '/paginate?page=' + page, filter);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models';

@Injectable()
export class AgentService {
    private url: string = environment.urlApi + 'agents';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    get(): Observable<User[]> {
        return this.http.get<User[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<User> {
        return this.http.get<User>(this.url + '/' + id).map(r => r);
    }
    getExist(username: string): Observable<Boolean> {
        return this.http.post<Boolean>(this.url + '/exist_user', { username: username }).map(r => r);
    }
    post(model: User): Observable<any> {
      return this.http.post<any>(this.url, model).map(r => r);
    }
    put(model: User): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model ).map(r => r);
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

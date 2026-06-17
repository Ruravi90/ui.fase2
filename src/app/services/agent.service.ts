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
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    get(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
    }
    getById(id: number): Observable<User> {
        return this.http.get<User>(this.url + '/' + id);
    }
    getExist(username: string): Observable<boolean> {
        return this.http.post<boolean>(this.url + '/exist_user', { username: username });
    }
    post(model: User): Observable<any> {
      return this.http.post<any>(this.url, model);
    }
    put(model: User): Observable<any> {
      return this.http.put<any>(this.url + '/' + model.id, model );
    }
    delete(id: number): Observable<any> {
      return this.http.delete<any>(this.url + '/' + id);
    }
}

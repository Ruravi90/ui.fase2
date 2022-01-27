import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, Paginate } from '../models';

@Injectable()
export class UserService {
    private url: string = environment.urlApi + 'users';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
    }
    paginate(perPage: number,shared: string = ''): Observable<Paginate> {
        return this.http.post<Paginate>(this.url + '/paginate', { per_page: perPage }).map(r => r);
    }
    getForUrl(page: number, perPage: number): Observable<Paginate> {
        return this.http.post<Paginate>(this.url + '/paginate?page=' + page, { per_page: perPage}).map(r => r);
    }
    login(model: User): Observable<any> {
        return this.http.post<any>(this.url + '/login', model).map(r => r);
    }
    isLogin(): boolean {
        if (!localStorage.getItem('currentUser')) {
            return false;
        }
        return true;
    }
    getToken(): string {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (localStorage.getItem('currentUser')) {
            return currentUser.token;
        }
        return '';
    }
    get(): Observable<User[]> {
        return this.http.get<User[]>(this.url).map(r => r);
    }
    getById(id: number): Observable<User> {
        return this.http.get<User>(this.url + '/' + id).map(r => r);
    }
    getExist(username: string): Observable<Boolean> {
        return this.http.post<Boolean>(this.url + '/exist_user', { username: username }).map((r:any) =>r.status);
    }
    post(model: User): Observable<any> {
        return this.http.post<any>(this.url, model).map(r => r);
    }
    put(model: User): Observable<any> {
        return this.http.put<any>(this.url + '/' + model.id, model).map(r => r);
    }
    delete(id: number): Observable<any> {
        return this.http.delete<any>(this.url + '/' + id).map(r => r);
    }
}

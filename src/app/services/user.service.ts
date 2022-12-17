import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, Paginate } from '../models';

@Injectable()
export class UserService {
    private url: string = environment.urlApi + 'users';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
    }
    paginate(perPage: number,shared: string = ''): Observable<Paginate> {
        return this.http.post<Paginate>(this.url + '/paginate', { per_page: perPage }).pipe(map((r:any)=> r));
    }
    getForUrl(page: number, perPage: number): Observable<Paginate> {
        return this.http.post<Paginate>(this.url + '/paginate?page=' + page, { per_page: perPage}).pipe(map((r:any)=> r));
    }
    login(model: User): Observable<any> {
        return this.http.post<any>(environment.urlApi + 'auth/login', model).pipe(map((r:any)=> r));
    }
    isLogin(): boolean {
        if (!localStorage.getItem('currentUser')) {
            return false;
        }
        return true;
    }
    getToken(): string {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
        if (localStorage.getItem('currentUser')) {
            return currentUser.token;
        }
        return '';
    }
    get(): Observable<User[]> {
        return this.http.get<User[]>(this.url).pipe(map((r:any)=> r));
    }
    getById(id: number): Observable<User> {
        return this.http.get<User>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
    getExist(username: string): Observable<Boolean> {
        return this.http.post<Boolean>(this.url + '/exist_user', { username: username }).pipe(map((r:any) =>r.status));
    }
    post(model: User): Observable<any> {
        return this.http.post<any>(this.url, model).pipe(map((r:any)=> r));
    }
    put(model: User): Observable<any> {
        return this.http.put<any>(this.url + '/' + model.id, model).pipe(map((r:any)=> r));
    }
    delete(id: number): Observable<any> {
        return this.http.delete<any>(this.url + '/' + id).pipe(map((r:any)=> r));
    }
}

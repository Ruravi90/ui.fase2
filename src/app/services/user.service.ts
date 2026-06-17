import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, Paginate } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService { // Trigger reload
    private url: string = environment.urlApi + 'users';
    private currentUser: User = new User();
    constructor(private http: HttpClient) {
    }
    paginate(perPage: number,shared: string = ''): Observable<Paginate> {
        return this.http.post<Paginate>(this.url + '/paginate', { per_page: perPage });
    }
    getForUrl(page: number, perPage: number): Observable<Paginate> {
        return this.http.post<Paginate>(this.url + '/paginate?page=' + page, { per_page: perPage});
    }
    login(model: User): Observable<any> {
        return this.http.post<any>(this.url + '/login', model);
    }
    isLogin(): boolean {
        const user = localStorage.getItem('currentUser');
        if (!user || user === '{}') {
            return false;
        }
        return true;
    }
    getToken(): string {
        const userStr = localStorage.getItem('currentUser');
        if (userStr && userStr !== '{}') {
            const currentUser = JSON.parse(userStr);
            return currentUser.token || '';
        }
        return '';
    }
    get(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
    }
    getById(id: number): Observable<User> {
        return this.http.get<User>(this.url + '/' + id);
    }
    getExist(username: string): Observable<boolean> {
        return this.http.post<any>(this.url + '/exist_user', { username: username }).pipe(map((r:any) => r.status));
    }
    post(model: User): Observable<any> {
        return this.http.post<any>(this.url, model);
    }
    put(model: User): Observable<any> {
        return this.http.put<any>(this.url + '/' + model.id, model);
    }
    delete(id: number): Observable<any> {
        return this.http.delete<any>(this.url + '/' + id);
    }
}

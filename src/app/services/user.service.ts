import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, Paginate } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private url = environment.urlApi + 'users';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {}

    get currentUser(): User {
        return this.currentUserSubject.value ?? new User();
    }

    paginate(perPage: number, shared: string = ''): Observable<Paginate> {
        return this.http.post<Paginate>(this.url + '/paginate', { per_page: perPage });
    }

    getForUrl(page: number, perPage: number): Observable<Paginate> {
        return this.http.post<Paginate>(this.url + '/paginate?page=' + page, { per_page: perPage });
    }

    login(model: User): Observable<any> {
        return this.ensureCsrfCookie().pipe(
            switchMap(() => this.http.post<any>(this.url + '/login', model)),
            tap((response) => {
                if (response?.success) {
                    this.setCurrentUser(response.success);
                }
            })
        );
    }

    logout(): Observable<any> {
        return this.http.post<any>(this.url + '/logout', {}).pipe(
            tap(() => this.clearCurrentUser()),
            catchError(() => {
                this.clearCurrentUser();
                return of(null);
            })
        );
    }

    me(): Observable<User | null> {
        return this.http.get<any>(this.url + '/me').pipe(
            map((response) => {
                const user = response?.success ? this.setCurrentUser(response.success) : null;
                return user;
            }),
            catchError(() => {
                this.clearCurrentUser();
                return of(null);
            })
        );
    }

    ensureSession(): Observable<User | null> {
        if (this.currentUserSubject.value) {
            return of(this.currentUserSubject.value);
        }
        return this.me();
    }

    isLogin(): boolean {
        return this.currentUserSubject.value !== null;
    }

    loadCurrentUser(user: User): void {
        this.setCurrentUser(user);
    }

    get(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
    }

    getById(id: number): Observable<User> {
        return this.http.get<User>(this.url + '/' + id);
    }

    getExist(username: string): Observable<boolean> {
        return this.http.post<any>(this.url + '/exist_user', { username }).pipe(map((r: any) => r.status));
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

    private ensureCsrfCookie(): Observable<void> {
        return this.http.get<void>(environment.apiRoot + '/sanctum/csrf-cookie');
    }

    private setCurrentUser(data: User): User {
        const user = Object.assign(new User(), data);
        delete user.token;
        this.currentUserSubject.next(user);
        return user;
    }

    private clearCurrentUser(): void {
        this.currentUserSubject.next(null);
    }
}

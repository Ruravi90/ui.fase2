import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InitService {
    private url: string = environment.urlApi + 'init';

    constructor(private http: HttpClient) {}

    getScheduleInit(): Observable<any> {
        return this.http.get<any>(`${this.url}/schedule`);
    }

    getSaleInit(userId: number): Observable<any> {
        return this.http.get<any>(`${this.url}/sale`, {
            params: { user_id: userId.toString() }
        });
    }

    getDashboardInit(): Observable<any> {
        return this.http.get<any>(`${this.url}/dashboard`);
    }
}

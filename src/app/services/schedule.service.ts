import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = `${environment.urlApi}schedules`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  find(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  add(schedule: any): Observable<any> {
    return this.http.post(this.apiUrl, schedule);
  }

  update(id: number, schedule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, schedule);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

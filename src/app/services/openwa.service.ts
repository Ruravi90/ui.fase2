import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenwaService {
  private url = environment.urlApi + 'openwa/sessions';

  constructor(private http: HttpClient) { }

  getSessions() {
    return this.http.get<any[]>(this.url);
  }

  createSession(data: any) {
    return this.http.post(this.url, data);
  }

  startSession(id: number) {
    return this.http.post(`${this.url}/${id}/start`, {});
  }

  getQr(id: number) {
    return this.http.get(`${this.url}/${id}/qr`);
  }

  deleteSession(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}

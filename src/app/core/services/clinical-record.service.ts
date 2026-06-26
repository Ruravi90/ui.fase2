import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClinicalRecordService {

  private apiURL = environment.urlApi + 'clinical_notes';

  constructor(private http: HttpClient) { }

  getHistory(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/history/${clientId}`);
  }

  saveDraft(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/draft`, data);
  }

  signNote(id: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/${id}/sign`, data);
  }
}

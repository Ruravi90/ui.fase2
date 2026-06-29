import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PromoCode } from '../../models/saas/promo-code';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {
  private apiUrl = `${environment.urlApi}saas/promo-codes`;

  constructor(private http: HttpClient) {}

  getPromoCodes(): Observable<PromoCode[]> {
    return this.http.get<PromoCode[]>(this.apiUrl);
  }

  getPromoCode(id: number): Observable<PromoCode> {
    return this.http.get<PromoCode>(`${this.apiUrl}/${id}`);
  }

  createPromoCode(promoCode: PromoCode): Observable<PromoCode> {
    return this.http.post<PromoCode>(this.apiUrl, promoCode);
  }

  updatePromoCode(id: number, promoCode: PromoCode): Observable<PromoCode> {
    return this.http.put<PromoCode>(`${this.apiUrl}/${id}`, promoCode);
  }

  deletePromoCode(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

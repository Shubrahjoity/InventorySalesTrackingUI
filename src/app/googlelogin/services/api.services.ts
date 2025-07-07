import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:5001/api'; // change to your real backend

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    debugger;
    const token = sessionStorage.getItem('accessToken'); // or get it from a service
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getPrices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/prices`,{
      headers: this.getAuthHeaders()
    });
  }

  getTopSold(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/most-sold`,{
      headers: this.getAuthHeaders()
    });
  }

  getReorderList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reorder`,{
      headers: this.getAuthHeaders()
    });
  }
 getProductDetails(id: string) {
  const headers = this.getAuthHeaders();
  return this.http.get<any>(`${this.baseUrl}/product/${id}`, { headers });
}
 getProductDetailsbyBarcode(barcode: string) {
  const headers = this.getAuthHeaders();
  return this.http.get<any>(`${this.baseUrl}/product/barcode/${barcode}`, { headers });
}
saveSalesInvoice(invoice:any)
{
  const headers = this.getAuthHeaders();
  console.log(JSON.stringify(invoice));
  return this.http.post(`${this.baseUrl}/sales/savedatasales`,invoice, { headers });
}

}

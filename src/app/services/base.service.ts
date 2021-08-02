import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private api_url = environment.baseApi;
  private token: string;
  private headers: HttpHeaders;

  constructor(private http:HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Accept: 'application/json'    
    })
  }

  setHeaders(){
    this.token = localStorage.getItem("token");
    if(this.token != ''){
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`
      })
    }
  }

  get(path : string) : Observable<any> {
    return this.http.get(`${this.api_url}${path}`, {headers : this.headers})
  }

  post(path : string, data : any):Observable<any> {
    return this.http.post(`${this.api_url}${path}`, data, {headers : this.headers})
  }

}

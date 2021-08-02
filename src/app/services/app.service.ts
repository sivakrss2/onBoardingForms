import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private _baseApi:BaseService) { }

  login(data:any) {
    return this._baseApi.post("/api/login", data)
  }

}

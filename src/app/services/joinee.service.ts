import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class JoineeService {


  constructor(private http: HttpClient,
              private router: Router,) {}

    /** Get the candidate detail from the candidate table from the database
   * created on 28/07/2020
   * by siva chandru
   * params: token, guid */

  checkurl(guid) :Observable<any> {
    const API_URL = environment.baseApi;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let options = { headers: headers };

    return this.http.get<any>(
      API_URL + "/api/joinee/checkurl/"+ guid,
      options
    );
  }

  /** GCheck the joinee details from the database
   * created on 21/07/2020
   * by siva chandru
   * params: token, guid */

  CheckJoineeDetails(guid) {
    const API_URL = environment.baseApi;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let options = { headers: headers };

    return this.http.get<any>(
      API_URL + "/api/joinee/checkDetails/"+ guid,
      options
    );
  }

  /** Check the joinee details link isdabled status from the database
   * created on 21/07/2020
   * by siva chandru
   * params: token, guid */

  CheckJoineeDetailslinkStatus(guid) {
    const API_URL = environment.baseApi;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let options = { headers: headers };

    return this.http.get<any>(
      API_URL + "/api/joinee/checkDetailLinkStatus/"+ guid,
      options
    );
  }

  /** Get the candidate detail from the candidate table from the database
   * created on 21/07/2020
   * by siva chandru
   * params: token, guid */

  getCandidateDetails(guid) {
    const API_URL = environment.baseApi;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let options = { headers: headers };

    return this.http.get<any>(
      API_URL + "/api/candidatedetail/"+ guid,
      options
    );
  }

  /** Get the joinee details from the joinee tables from the database
   * created on 27/07/2020
   * by siva chandru
   * params: token, guid */

  getJoineeInfoDetails(guid) {
    const API_URL = environment.baseApi;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let options = { headers: headers };

    return this.http.get<any>(
      API_URL + "/api/joineedetail/"+ guid,
      options
    );
  }

    /** Add joinee all detail to the database
  * created on 30/07/2020
   * by siva chandru
   * params:  new joinee details*/

  addJoineeAllDetails(details) {
    const API_URL = environment.baseApi;
    const headers = new HttpHeaders({
    });
    const options = { headers: headers };
    return this.http.post<any>(
      API_URL + "/api/joinee/addJoineeInfo",
      details,
      options
    );
  }
  
  /** Add joinee details to the database
  * created on 21/07/2020
   * by siva chandru
   * params:  new joinee details*/

  addJoineeDetails(details) {
    const API_URL = environment.baseApi;
    const headers = new HttpHeaders({
    });
    const options = { headers: headers };
    return this.http.post<any>(
      API_URL + "/api/joinee/addpersonalinfo",
      details,
      options
    );
  }

  /** Add joinee personal reference to the database
  * created on 24/07/2020
   * by siva chandru
   * params:  new joinee details*/

  addJoineePersonalReferenceDetails(details) {
    const API_URL = environment.baseApi;
    const headers = new HttpHeaders({
    });
    const options = { headers: headers };
    return this.http.post<any>(
      API_URL + "/api/joinee/addpersonalreferenceinfo",
      details,
      options
    );
  }

  /** Add joinee personal reference to the database
  * created on 24/07/2020
   * by siva chandru
   * params:  new joinee details*/

  addJoineeProfessionalReferenceDetails(details) {
    const API_URL = environment.baseApi;
    const headers = new HttpHeaders({
    });
    const options = { headers: headers };
    return this.http.post<any>(
      API_URL + "/api/joinee/addprofessionalreferenceinfo",
      details,
      options
    );
  }

  /** Add joinee previous company details to the database
  * created on 24/07/2020
   * by siva chandru
   * params:  new joinee details*/

  addJoineePreviousCompanyDetails(details) {
    const API_URL = environment.baseApi;
    const headers = new HttpHeaders({
    });
    const options = { headers: headers };
    return this.http.post<any>(
      API_URL + "/api/joinee/addpreviouscompanyinfo",
      details,
      options
    );
  }

  /** Add joinee joinee document details to the database
  * created on 28/07/2020
   * by siva chandru
   * params:  new joinee details*/

  addJoineeDocumentDetails(details) {
    const API_URL = environment.baseApi;
    const headers = new HttpHeaders({
    });
    const options = { headers: headers };
    return this.http.post<any>(
      API_URL + "/api/joinee/adddocumentinfo",
      details,
      options
    );
  }

   /** Delete document from database
   * created on 30/07/2020
   * by siva chandru*/
  deleteDocument(id) {
    const API_URL = environment.baseApi;
    const headers = new HttpHeaders({
    });
    const options = { headers: headers };

    return this.http.post<any>(
      API_URL + "/api/joinee/deleteDoc/" + id ,
      options
    );
  }
}
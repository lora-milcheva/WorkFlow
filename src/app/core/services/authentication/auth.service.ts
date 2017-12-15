import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { catchError, map, tap } from 'rxjs/operators';

// Notifications
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

// Models
import { RegisterModel } from '../../models/register.model';
import { LoginModel } from '../../models/login.model';

const appKey = 'kid_ry_Tw0UZM';  // APP KEY HERE;
const appSecret = '522e7cb94b524b619f246db9bafc5a8b';// APP SECRET HERE;
const registerUrl = `https://baas.kinvey.com/user/${appKey}`;
const loginUrl = `https://baas.kinvey.com/user/${appKey}/login`;
const logoutUrl = `https://baas.kinvey.com/user/${appKey}/_logout`;

@Injectable()
export class AuthenticationService {
  private currentAuthtoken: string;
  private loggedIn: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient,
              private toastr: ToastsManager) {
  }

  login(data: LoginModel): Observable<Object> {
    return this.http
      .post(
        loginUrl,
        JSON.stringify(data),
        {headers: this.createAuthHeaders('Basic')}
      )
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  register(data: RegisterModel): Observable<Object> {
    return this.http
      .post(
        registerUrl,
        JSON.stringify(data),
        {headers: this.createAuthHeaders('Basic')}
      )
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  logout() {
    if (localStorage.getItem('authtoken') !== undefined) {
      return this.http
        .post(
          logoutUrl,
          {},
          {headers: this.createAuthHeaders('Kinvey')}
        )
        .pipe(
          catchError(err => this.handleError(err))
        );
    }

    return;
  }

  isLoggedIn() {
    const authtoken: string = localStorage.getItem('authtoken');
    this.currentAuthtoken = authtoken;
    return authtoken === this.currentAuthtoken;
  }

  getUser () {
    return this.http
      .get(
        'https://baas.kinvey.com/user/' + appKey + `/?query={"username":"${localStorage.getItem('username')}"}`,
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  get authtoken() {
    return this.currentAuthtoken;
  }

  set authtoken(value: string) {
    this.currentAuthtoken = value;
  }

  private createAuthHeaders(type: string): HttpHeaders {
    if (type === 'Basic') {
      return new HttpHeaders({
        'Authorization': `Basic ${btoa(`${appKey}:${appSecret}`)}`,
        'Content-Type': 'application/json'
      });
    } else {
      return new HttpHeaders({
        'Authorization': `Kinvey ${localStorage.getItem('authtoken')}`,
        'Content-Type': 'application/json'
      });
    }
  }

  private handleError(err) {
    console.log(err);
    this.toastr.error(err.error.description);
    return of(err);
    // return Observable.throw(new Error(err.message));
  }
}

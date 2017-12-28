import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { catchError, map, tap } from 'rxjs/operators';

// Notifications
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

// Models
import { ClientModel } from '../../models/client.model';

// Kinvey
const appKey = 'kid_ry_Tw0UZM';  // APP KEY HERE;
const appSecret = '522e7cb94b524b619f246db9bafc5a8b';  // APP SECRET HERE;
const baseUrl = 'https://baas.kinvey.com';

// URL-s
const clientsUrl = baseUrl + '/appdata/' + appKey + '/clients';


@Injectable()
export class ClientService {

  constructor(private http: HttpClient,
              private toastr: ToastsManager) {
  }

  createClient(data: ClientModel): Observable<ClientModel> {
    return this.http
      .post<ClientModel>(
        clientsUrl,
        JSON.stringify(data),
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(projects => this.toastr.success(`client created`)),
        catchError(err => this.handleError(err))
      );
  }

  findClientByName(clientName: string): Observable<ClientModel> {
    return this.http
      .get<ClientModel>(
        clientsUrl + `?query={"name":"${clientName}"}`,
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(client => this.toastr.success(`client found`)),
        catchError(err => this.handleError(err))
      );
  }

  getAllClients(): Observable<ClientModel[]> {
    return this.http
      .get<ClientModel[]>(
        clientsUrl,
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        // tap(projects => this.toastr.success(`clients loaded`)),
        catchError(err => this.handleError(err))
      );
  }

  save(client: any): Observable<ClientModel> {
    console.log(client);
    return this.http
      .put<ClientModel>(
        clientsUrl + '/' + client._id,
        JSON.stringify(client),
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(projects => this.toastr.success(`client created`)),
        catchError(err => this.handleError(err))
      );
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
    if (err.status >= 200 && err.status < 300) {
      this.toastr.success(err.statusText, err.status);
    }
    if (err.status >= 400 && err.status < 500) {
      this.toastr.error(err.statusText, err.status);
    }
    return of(err);
    // return Observable.throw(new Error(err.message));
  }
}

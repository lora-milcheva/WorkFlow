import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { catchError, map, tap } from 'rxjs/operators';

// Notifications
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

// Models
import { ProjectModel } from '../../models/project.model';
import { WorkDayModel } from '../../models/work-day.model';
import { DbWorkDayModel } from '../../models/db-work-day.model';


// Kinvey
const appKey = 'kid_ry_Tw0UZM';  // APP KEY HERE;
const appSecret = '522e7cb94b524b619f246db9bafc5a8b';  // APP SECRET HERE;
const baseUrl = 'https://baas.kinvey.com';

// URL-s
const createProjectUrl = baseUrl + '/appdata/' + appKey + '/projects';
const loadCurrentUserProjectsUrl = baseUrl + '/appdata/' + appKey + `/projects?query={"creator":"${localStorage.getItem('username')}"}`;
const getProjectById = baseUrl + '/appdata/' + appKey + '/projects/';
const workTimeUrl = baseUrl + '/appdata/' + appKey + '/work-days';


@Injectable()
export class ProjectService {

  constructor(private http: HttpClient,
              private toastr: ToastsManager) {
  }

  createProject(data: ProjectModel): Observable<Object> {
    return this.http
      .post<ProjectModel>(
        createProjectUrl,
        JSON.stringify(data),
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(projects => this.toastr.success(`project created`)),
        catchError(err => this.handleError(err))
      );
  }

  loadCurrentUserProjects(): Observable<ProjectModel[]> {
    return this.http
      .get<ProjectModel[]>(
        loadCurrentUserProjectsUrl,
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        // tap(projects => this.toastr.success(`projects loaded`)),
        catchError(err => this.handleError(err))
      );
  }

  getProjectById(projectId: string): Observable<ProjectModel> {
    return this.http
      .get<ProjectModel>(
        getProjectById + projectId,
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        // tap(projects => this.toastr.success(`projects loaded`)),
        catchError(err => this.handleError(err))
      );
  }

  saveWorkTime(data: WorkDayModel): Observable<WorkDayModel> {
    return this.http
      .post<WorkDayModel>(
        workTimeUrl,
        JSON.stringify(data),
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(projects => this.toastr.success(`Time saved.`)),
        catchError(err => this.handleError(err))
      );
  }

  updateWorkTime(workTimeId: string, data: WorkDayModel): Observable<WorkDayModel> {
    return this.http
      .put<WorkDayModel>(
        workTimeUrl  + '/' + workTimeId,
        JSON.stringify(data),
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(projects => this.toastr.success(`Time updated.`)),
        catchError(err => this.handleError(err))
      );
  }

  getProjectTime(projectId: string): Observable<DbWorkDayModel[]> {
    return this.http
      .get<DbWorkDayModel[]>(
        workTimeUrl + `?query={"projectId":"${projectId}"}`,
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        // tap(projects => this.toastr.success(`schedule loaded`)),
        catchError(err => this.handleError(err))
      );
  }

  saveProject(projectId: string, data: ProjectModel): Observable<ProjectModel> {
    return this.http
      .put<ProjectModel>(
        getProjectById + projectId,
        JSON.stringify(data),
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(projects => this.toastr.success(`project updated`)),
        catchError(err => this.handleError(err))
      );
  }

  // searchProjects(projectName: string)  {
  //   return ProjectModel[]
  //     .debounceTime(1000)
  //     .distinctUntilChanged()
  //     .switchMap(x => this.getPokemons(x));
  // }
  //
  // getPokemons(searchedPokemonName) {
  //   if (searchedPokemonName === '') {
  //     return [{}];
  //   }
  //   return this.http.get(baseUrl + '/pokedex?pokename=' + searchedPokemonName);
  // }

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

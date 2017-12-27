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
const projectsUrl = baseUrl + '/appdata/' + appKey + '/projects';
const workTimeUrl = baseUrl + '/appdata/' + appKey + '/work-days';


@Injectable()
export class ProjectService {
  private projectSource = new Subject<any>();
  projectReceived$ = this.projectSource.asObservable();

  constructor(private http: HttpClient,
              private toastr: ToastsManager) {
  }

  updateProjectData(data) {
    this.projectSource.next(data);
  }

  createProject(data: ProjectModel): Observable<Object> {
    return this.http
      .post<ProjectModel>(
        projectsUrl,
        JSON.stringify(data),
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(projects => this.toastr.success(`project created`)),
        catchError(err => this.handleError(err))
      );
  }

  loadCurrentUserProjects(): Observable<ProjectModel[]> {
    let username = localStorage.getItem('username');
    return this.http
      .get<ProjectModel[]>(
        projectsUrl + '/' + `?query={"creator":"${username}"}`,
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        // tap(projects => this.toastr.success(`projects loaded`)),
        catchError(err => this.handleError(err))
      );
  }

  loadAllProjects(): Observable<ProjectModel[]> {
    return this.http
      .get<ProjectModel[]>(
        projectsUrl,
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
        projectsUrl + '/' + projectId,
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

  deleteWorkTime(workTimeId: string): Observable<WorkDayModel> {
    return this.http
      .delete<WorkDayModel>(
        workTimeUrl  + '/' + workTimeId,
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(projects => this.toastr.success(`Time removed.`)),
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
        projectsUrl + '/' + projectId,
        JSON.stringify(data),
        {headers: this.createAuthHeaders('Kinvey')}
      )
      .pipe(
        tap(projects => this.toastr.success(`project saved`)),
        catchError(err => this.handleError(err))
      );
  }

  deleteProject(projectId: string) {
    console.log('from delete service');
    return this.http
      .delete(
        projectsUrl + '/' + projectId,
        {headers: this.createAuthHeaders('Kinvey')},
      )
      .pipe(
        tap(projects => this.toastr.success(`project deleted`)),
        catchError(err => this.handleError(err))
      );
  }

  deleteProjectWorkDays(projectId: string) {
    console.log('from delete time service');
    return this.http
      .delete(
        workTimeUrl  + `?query={"projectId":"${projectId}"}`,
        {headers: this.createAuthHeaders('Kinvey')},
      )
      .pipe(
        tap(projects => this.toastr.success(`project time deleted`)),
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
        'Authorization': `Kinvey ` + localStorage.getItem('authtoken'),
        'Content-Type': 'application/json'
      });
    }
  }

  private handleError(err) {
    console.log(err);
    if (err.status >= 200 && err.status < 300) {
      this.toastr.success(err.statusText, err.error.description);
    }
    if (err.status >= 400 && err.status < 500) {
      this.toastr.error(err.statusText, err.error.description);
    }
    return of(err);
    // return Observable.throw(new Error(err.message));
  }
}

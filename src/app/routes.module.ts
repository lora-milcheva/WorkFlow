import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { LogoutComponent } from './user/logout/logout.component';
import { ProjectDetailsComponent } from './components/projects/project-details/project-details.component';
import { ProjectListComponent } from './components/projects/project-list/project-list.component';
import { ProjectCreateComponent } from './components/projects/project-create/project-create.component';
import { ProjectEditComponent } from './components/projects/project-edit/project-edit.component';
import { ClientCreateComponent } from './components/clients/client-create/client-create.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';


// Guards
import { AuthGuard } from './core/guards/auth.guard';


const routes: Routes = [
  { path: '', component: ProjectListComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'project/list', canActivate: [AuthGuard], component: ProjectListComponent },
  { path: 'project/create', canActivate: [AuthGuard], component: ProjectCreateComponent, },
  { path: 'project/details/:id', canActivate: [AuthGuard], component: ProjectDetailsComponent },
  { path: 'project/edit/:id', canActivate: [AuthGuard], component: ProjectEditComponent },
  { path: 'client/create', canActivate: [AuthGuard], component: ClientCreateComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutesModule {

}

import { Component, OnInit } from '@angular/core';

// Models
import { ProjectModel } from '../../../core/models/project.model';

// Services
import { ProjectService } from '../../../core/services/project/project.service';
import { AuthenticationService } from '../../../core/services/authentication/auth.service';
import { Router } from '@angular/router';
import { logWarnings } from "protractor/built/driverProviders";

@Component({
  selector: 'app-projects-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  providers: []
})
export class ProjectListComponent implements OnInit {
  public projects: ProjectModel[];   // Check if true
  public activeProjects: ProjectModel[];
  public closedProjects: ProjectModel[];

  private user: any;
  private isAdmin: boolean;

  constructor(private projectService: ProjectService,
              private authService: AuthenticationService) {
    this.projects = [];
    this.activeProjects = [];
    this.closedProjects = [];
  }

  ngOnInit() {
    this.checkUser();
  }

  loadProjects(): void {
    this.projectService
      .loadCurrentUserProjects()
      .subscribe(projectsReceived => {
        this.projects = projectsReceived;
        this.filterProjects();
      });
  }

  loadAllProjects() {
    this.projectService
      .loadAllProjects()
      .subscribe(projectsReceived => {
        this.projects = projectsReceived;
        this.filterProjects();
      });
  }

  checkUser() {
    this.authService
      .getUser()
      .subscribe(data => {
        this.user = data[0];

        if (this.user._kmd.hasOwnProperty('roles')) {
          this.isAdmin = true;
        }

        if (this.isAdmin) {
          this.loadAllProjects();
        } else {
          this.loadProjects();
        }
      });
  }

  filterProjects() {
    for (const project of this.projects) {
      if ( project.status === 'active') {
        this.activeProjects.push(project);
      } else {
        this.closedProjects.push(project);
      }
    }
  }
}


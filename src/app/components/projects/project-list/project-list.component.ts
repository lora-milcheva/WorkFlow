import { Component, OnInit } from '@angular/core';

// Models
import { ProjectModel } from '../../../core/models/project.model';

// Services
import { ProjectService } from '../../../core/services/project/project.service';
import { AuthenticationService } from '../../../core/services/authentication/auth.service';
import { Router } from '@angular/router';


// jQuery
declare let $: any;

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
  private loaded: boolean;
  private message: string;

  constructor(private projectService: ProjectService,
              private authService: AuthenticationService) {
    this.projects = [];
    this.activeProjects = [];
    this.closedProjects = [];

    this.loaded = false;
    this.message = 'projects loading...';
  }

  ngOnInit() {
    this.checkUser();
    this.showInfoOnTop();
  }

  showInfoOnTop() {
    $(document).on('mouseover', '.project-box-2', function (e) {
      $(this).css('z-index', 1);
    });
    $(document).on('mouseleave', '.project-box-2', function (e) {
      $(this).css('z-index', 0);
    });
  }

  loadProjects(): void {
    this.projectService
      .loadCurrentUserProjects()
      .subscribe(projectsReceived => {
        console.log(projectsReceived.length);
        if (projectsReceived.length === 0) {
          this.message = 'No projects found';
        }
        this.projects = projectsReceived;
        this.filterProjects();
        this.loaded = true;
        this.message = '';
      });
  }

  loadAllProjects() {
    this.projectService
      .loadAllProjects()
      .subscribe(projectsReceived => {
        if (projectsReceived.length === 0) {
          this.message = 'No projects found';
        }
        this.projects = projectsReceived;
        this.filterProjects();
        this.loaded = true;
        this.message = '';
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
      if (project.status === 'active') {
        this.activeProjects.push(project);
      } else {
        this.closedProjects.push(project);
      }
    }
  }
}


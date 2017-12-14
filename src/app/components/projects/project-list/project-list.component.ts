import { Component, OnInit } from '@angular/core';

import { ProjectModel } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  providers: []
})
export class ProjectListComponent implements OnInit {
  public projects: ProjectModel[];   // Check if true
  public activeProjects: ProjectModel[];
  public closedProjects: ProjectModel[];

  constructor(private projectService: ProjectService) {
    this.projects = [];
    this.activeProjects = [];
    this.closedProjects = [];
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService
      .loadCurrentUserProjects()
      .subscribe(projectsReceived => {
        this.projects = projectsReceived;
        this.filterProjects();
        console.log(projectsReceived);
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


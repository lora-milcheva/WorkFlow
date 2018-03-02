import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

// Models
import { ProjectModel } from '../../../core/models/project.model';
import { ClientModel } from '../../../core/models/client.model';

// Services
import { ClientService } from '../../../core/services/client/client.service';
import { ProjectService } from '../../../core/services/project/project.service';
import { AuthenticationService } from '../../../core/services/authentication/auth.service';


@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
  providers: []
})
export class ClientDetailsComponent implements OnInit {
  public projects: ProjectModel[];
  public activeProjects: ProjectModel[];
  public closedProjects: ProjectModel[];
  public clientId: string;
  public client: ClientModel;

  constructor(private clientService: ClientService,
              private projectService: ProjectService,
              private authService: AuthenticationService,
              private route: ActivatedRoute) {
    this.projects = [];
    this.activeProjects = [];
    this.closedProjects = [];
  }

  ngOnInit() {
    this.clientId = this.route.snapshot.params['id'];

    this.loadClientProjects();
    this.loadClientData();
  }

  loadClientProjects(): void {
    this.projectService
      .getProjectsByClient(this.clientId)
      .subscribe(projectsReceived => {
        this.projects = projectsReceived;

        this.filterProjects();
      });
  }

  loadClientData(): void {
    this.clientService
      .findClientById(this.clientId)
      .subscribe(clientReceived => {
        this.client = clientReceived[0];

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


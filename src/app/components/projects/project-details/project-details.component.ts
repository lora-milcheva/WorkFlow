import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


// Confirm message
import {ConfirmOptions, Position} from 'angular2-bootstrap-confirm';
import {Positioning} from 'angular2-bootstrap-confirm/position';
// Or if you're already using the @ng-bootstrap/ng-bootstrap module
// import {Positioning} from '@ng-bootstrap/ng-bootstrap/util/positioning';
// or if you're using the ng2-bootstrap module
// import {PositionService as Positioning} from 'ng2-bootstrap/components/position';

// Models
import { ProjectModel } from '../../../core/models/project.model';


// Services
import { ProjectService } from '../../../core/services/project/project.service';
import { AuthenticationService } from '../../../core/services/authentication/auth.service';
import { ClientService } from '../../../core/services/client/client.service';



@Component({
  selector: 'app-project',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [ ],
})
export class ProjectDetailsComponent implements OnInit {
  public project: ProjectModel;
  public projectId: string;
  public hours: number;
  public minutes: number;
  public balance: number;

  private user: any;
  private isAdmin: boolean;

  constructor(private projectService: ProjectService,
              private authService: AuthenticationService,
              private clientService: ClientService,
              private route: ActivatedRoute,
              private router: Router) {
    this.projectId = this.route.snapshot.params['id'];

    this.projectService.projectReceived$.subscribe(data => {
      this.project = data;
      this.hours = Math.floor(this.project.totalTime / 60);
      this.minutes = (this.project.totalTime % 60);
      this.balance = this.project.budget - ( this.project.totalTime * this.project.rate / 60 );
    });
  }

  ngOnInit() {
    this.loadProject();
    this.checkUser();
  }

  checkUser() {
    this.authService
      .getUser()
      .subscribe(data => {
        this.user = data[0];

        if (this.user._kmd.hasOwnProperty('roles')) {
          this.isAdmin = true;
        }
      });
  }

  loadProject(): void {
    this.projectService
      .getProjectById(this.projectId)
      .subscribe(data => {
        this.project = data;
        this.hours = Math.floor(this.project.totalTime / 60);
        this.minutes = (this.project.totalTime % 60);
        this.balance = this.project.budget - ( this.project.totalTime * this.project.rate / 60 );
      });
  }

  closeProject() {
    this.project.status = 'closed';
    this.project.balance = this.balance;

    this.projectService
      .saveProject(this.projectId, this.project)
      .subscribe(data => {
          this.project = data;
        }
      );
  }

  editProject() {
    this.router.navigate(['project/edit/' + this.projectId]);
  }

  confirm(action) {
    switch (action) {
      case 'delete':
        if (confirm('Are you sure to DELETE ' + this.project.name + ' project?')) {
          this.deleteProject();
        }
        break;
      case 'close':
        if (confirm('Are you sure to CLOSE ' + this.project.name + ' project?')) {
          this.closeProject();
        }
        break;
    }
  }

  deleteProject() {
    this.projectService
      .deleteProject(this.projectId)
      .subscribe(data => {
      });

    this.clientService
      .findClientById(this.project.clientId)
      .subscribe(response => {
        const client = response[0];
        client.projectsById = client.projectsById.filter(item => item !== this.projectId)

        this.clientService
          .save(client)
          .subscribe(data => {
          });
      });

    this.projectService
      .deleteProjectWorkDays(this.projectId)
      .subscribe(res => {
        this.projectService.updateDeleteStatus(true);
        this.router.navigate(['/project/list']);
      });
  }
}

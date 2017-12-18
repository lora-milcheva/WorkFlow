import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// Confirm message
import { ConfirmOptions, Position } from 'angular2-bootstrap-confirm';
import { Positioning } from 'angular2-bootstrap-confirm/position';

// Models
import { ProjectModel } from '../../../core/models/project.model';
import { WorkDayModel } from '../../../core/models/work-day.model';

// Services
import { ProjectService } from '../../../core/services/project/project.service';
import { AuthenticationService } from '../../../core/services/authentication/auth.service';

import { PipesModule } from '../../../core/pipes/pipes.module';

@Component({
  selector: 'app-project',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [ConfirmOptions,
    // this is required so you can use the bundled position service rather than rely on the `@ng-bootstrap/ng-bootstrap` module
    {provide: Position, useClass: Positioning}]
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
              private route: ActivatedRoute,
              private router: Router) {
    this.projectId = this.route.snapshot.params['id'];
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

  deleteProject() {
    this.projectService
      .deleteProject(this.projectId)
      .subscribe(data => {
      });

    this.projectService
      .deleteProjectWorkDays(this.projectId)
      .subscribe(data => {
        console.log(data);
      })

    this.router.navigate(['/project/list']);
  }
}

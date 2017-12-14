import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// Models
import { ProjectModel } from '../../../core/models/project.model';
import { WorkDayModel } from '../../../core/models/work-day.model';

// Services
import { ProjectService } from '../../../core/services/project/project.service';


@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  public project: ProjectModel;
  public projectId: string;
  public clients: string[] = ['First Client', 'Second Client'];

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router) {
    this.projectId = this.route.snapshot.params['id'];
  }


  ngOnInit() {
    this.loadProject();
  }

  loadProject(): void {
    this.projectService
      .getProjectById(this.projectId)
      .subscribe(data => {
        this.project = data;
      });
  }

  createProject(): void {
    this.projectService
      .saveProject(this.projectId, this.project)
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['project/details/' + this.projectId]);
      });
  }

}

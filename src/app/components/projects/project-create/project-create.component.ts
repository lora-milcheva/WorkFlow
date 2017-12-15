import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Notifications
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

// Models
import { ProjectModel } from '../../../core/models/project.model';
import { ClientModel } from '../../../core/models/client.model';

// Services
import { ProjectService } from '../../../core/services/project/project.service';
import { ClientService } from '../../../core/services/client/client.service';


@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
  providers: [ProjectService]
})
export class ProjectCreateComponent implements OnInit {
  public project: ProjectModel;
  public clients: ClientModel[];
  private author: string = localStorage.getItem('username');

  constructor(private projectService: ProjectService,
              private clientService: ClientService,
              private router: Router,
              private toastr: ToastsManager) {
    this.project = new ProjectModel(this.author, '', '', 0, 0, 'active', new Date());
    this.project.totalTime = 0;
    this.clients = [];
  }

  ngOnInit() {
    this.loadAllClients();
  }

  createProject(): void {

    if (this.project.name.trim() === '') {
      this.toastr.warning('Project name required!');
    } else {
      this.projectService
        .createProject(this.project)
        .subscribe(data => {
          this.router.navigate(['project/list']);
        });
    }
  }

  loadAllClients(): void {
    this.clientService
      .getAllClients()
      .subscribe(data => {
        this.clients = data;
      });
  }

  clearForm() {
    this.project = new ProjectModel(this.author, '', '', 0, 0, 'active', new Date());
  }
}


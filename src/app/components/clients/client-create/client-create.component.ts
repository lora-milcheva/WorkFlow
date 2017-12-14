import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Notifications
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

// Models
import { ClientModel } from '../../../core/models/client.model';

// Services
import { ClientService } from '../../../core/services/client/client.service';


@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css'],
  providers: [ClientService]
})
export class ClientCreateComponent {
  public client: ClientModel;

  constructor(private clientService: ClientService,
              private router: Router,
              private toastr: ToastsManager) {
    this.client = new ClientModel('', []);
  }

  createClient(): void {

    if (this.client.name.trim() === '') {
      this.toastr.warning('Client name required!');
    } else {
      this.clientService
        .createClient(this.client)
        .subscribe(data => {
          console.log(data);
          this.router.navigate(['project/list']);
        });
    }
  }

  clearForm() {
    this.client = new ClientModel('', []);
  }
}


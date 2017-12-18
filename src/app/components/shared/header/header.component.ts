import { Component , OnInit, OnChanges } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: [ 'test.scss' ]
})
export class HeaderComponent implements OnInit{
  public user: string;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.getUser();
  }

  OnChanges() {
    this.getUser();
  }

  getUser() {
    this.user = localStorage.getItem('username');
  }
}

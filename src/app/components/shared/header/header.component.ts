import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['test.scss']
})
export class HeaderComponent implements OnInit {
  public user: string;

  constructor(private authService: AuthenticationService,
              private router: Router) {

    this.authService.userReceived$.subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.user = localStorage.getItem('username');
  }
}

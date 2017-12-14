import { Component, OnInit } from '@angular/core';
import { RegisterModel } from '../../core/models/register.model';
import { AuthenticationService } from '../../core/services/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
})
export class RegisterComponent {
  public model: RegisterModel;
  public registeredUser: string;
  public registerSuccess: boolean;
  public registerFail: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.model = new RegisterModel('', '', '', '');
  }

  register(): void {
    this.authService.register(this.model)
      .subscribe(
        data => {
          this.successfulRegister(data);
        },
        err => {
          this.registerFail = true;
        }
      );
  }

  get diagnostics(): string {
    return JSON.stringify(this.model);
  }

  successfulRegister(data): void {
    this.registerSuccess = true;
    this.registeredUser = data['username'];
    this.router.navigate(['/login']);
  }
}

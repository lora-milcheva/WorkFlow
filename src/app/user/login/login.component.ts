import { Component } from '@angular/core';
import { LoginModel } from '../../core/models/login.model';
import { AuthenticationService } from '../../core/services/authentication/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: []
})
export class LoginComponent {
  public model: LoginModel;
  public loginFail: boolean;
  public username: string;

  constructor(private authService: AuthenticationService,
              private router: Router) {
    this.model = new LoginModel('', '');
    this.username = '';
  }

  login(): void {
    this.authService
      .login(this.model)
      .subscribe(data => {
          this.successfulLogin(data);
        },
        err => {
          this.loginFail = true;
          console.log(err);
        }
      );
  }

  get diagnostics(): string {
    return JSON.stringify(this.model);
  }

  successfulLogin(data): void {
    this.authService.authtoken = data['_kmd']['authtoken'];
    localStorage.setItem('authtoken', data['_kmd']['authtoken']);
    localStorage.setItem('username', data['username']);
    this.loginFail = false;
    this.router.navigate(['/project/list']);
  }
}

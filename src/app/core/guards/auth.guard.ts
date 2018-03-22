import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../services/authentication/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public user: string;

  constructor(private router: Router,
              private authService: AuthenticationService) {

    this.authService.userReceived$.subscribe(data => {
      this.user = data;
    });
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.user) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

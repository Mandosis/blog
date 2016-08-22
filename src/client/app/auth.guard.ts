import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(private user: UserService, private router: Router) {};

  canActivate() {
    console.log('this.user.isAuthenticated()', this.user.isAuthenticated());
    if (!this.user.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    return this.user.isAuthenticated();
  }
}

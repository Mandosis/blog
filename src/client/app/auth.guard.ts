import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(private user: UserService, private router: Router) {};

  canActivate() {
    return this.user.isAuthenticated()
      .map(result => {
        if (!result) {
          this.router.navigate(['/dashboard/signin']);
        }
        return result;
      })
      .catch(() => {
        this.router.navigate(['/dashboard/signin']);
        return Observable.of(false);
      })
  }
}

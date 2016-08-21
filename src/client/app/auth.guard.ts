import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(private user: UserService) {};

  canActivate() {
    return this.user.isAuthenticated();
  }
}

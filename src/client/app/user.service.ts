import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()

export class UserService {
  private loggedIn: boolean = false;

  constructor(private http: Http) {};

  login(email: string, password: string) {
    return this.http
      .post('/v1/auth', JSON.stringify({ email, password }))
      .map(res => res.json())
      .map((res) => {

        // Set status of user
        if (res.success) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }

        return res.success;
      });
  };


  logout() {
    this.loggedIn = false;

    return this.http
      .get('/auth')
      .map(res => res.json())
      .map((res) => {
        return res.success;
      });
  };

  isAuthenticated() {
    return this.loggedIn;
  };
};

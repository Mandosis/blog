import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()

export class UserService {
  private loggedIn: boolean = false;

  constructor(private http: Http) {};

  login(username: string, password: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .post('/v1/auth', JSON.stringify({username, password}), { headers })
      .map(res => res.json())
      .map((res) => {

        // Set status of user
        if (res.success) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }

        console.log(this.loggedIn);

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

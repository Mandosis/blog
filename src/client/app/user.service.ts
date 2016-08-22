import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/take';

@Injectable()

export class UserService {
  private email: string;
  private name: string;

  constructor(private http: Http) {};

  login(username: string, password: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .post('/v1/auth', JSON.stringify({username, password}), { headers })
      .map(res => res.json())
      .map((res) => {
        return res.success;
      });
  };


  logout() {
    return this.http
      .get('/v1/auth')
      .map(res => res.json())
      .map((res) => {
        return res.success;
      });
  };

  isAuthenticated() {
    return this.http
      .get('/v1/auth')
      .map(res => res.json())
      .map((res) => {

        if (res.success) {
          this.email = res.data.email;
          this.name = res.data.name;
        }

        return res.success;
      });

  }
};

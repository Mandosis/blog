import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/take';

@Injectable()

export class UserService {
  private _email: string;
  private _name: string;

  constructor(private http: Http) {};

  get email() {
    return this._email
  };

  get name(){
    return this._name;
  };

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
      })
  };

  /**
   * Check authentication status with server
   * Returns Observable<boolean>
   */
  isAuthenticated() {
    return this.http
      .get('/v1/auth')
      .map(res => res.json())
      .map((res) => {

        if (res.success) {
          this._email = res.data.email;
          this._name = res.data.name;
        }

        return res.success;
      });

  }
};

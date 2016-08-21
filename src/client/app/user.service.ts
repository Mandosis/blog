import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()

export class UserService {
  private isAuthenticated: boolean = false;

  constructor(private http: Http) {};

  login(email: string, password: string) {
    return this.http
      .post('/v1/auth', JSON.stringify({ email, password }))
      .map(res => res.json())
      .map((res) => {

        // Set status of user
        if (res.success) {
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }

        return res.success;
      })
  };


  logout() {
    this.isAuthenticated = false;

    return this.http
      .get('/auth')
      .map(res => res.json())
      .map((res) => {
        return res.success;
      })
  }
};

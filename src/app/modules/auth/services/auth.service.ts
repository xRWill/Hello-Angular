import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { tokenNotExpired } from 'angular2-jwt';

import { AuthUser } from '../models/authUser';
import { LocalStorageService } from './../../core/services/localStorage';

@Injectable()
export class AuthService {

  // requests options
  private headers: Headers;
  private API_ENDPOINT: string = "/api/user/login";

  public constructor(private http: Http, private localStorageService: LocalStorageService) {
    this.headers = new Headers({ 'Accept': 'application/json' });
  }

  public loggedIn(): boolean {
    // are there a token and is a valid token?
    console.log(tokenNotExpired('token'));
    return tokenNotExpired('token');
  }

  /**
   * Process the login request to the API.
   */
  public login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post(this.API_ENDPOINT, { 'email': email, 'password': password }, this.headers)
      .map(res => res.json().data as AuthUser)
      .catch(this.handleError);
  }

  /**
   * Handle the error responses.
   */
  private handleError(error: Response | any) {
    let errorMsg: string;
    let body: string | any;

    if (error instanceof Response) {
      body = error.json() || '';
      const err = body.message || JSON.stringify(body);
      errorMsg = `${error.statusText || ''}, ${err}`;
    } else {
      errorMsg = error.message ? error.message : error.toString();
    }

    console.error(`${error.status} - ` + errorMsg);

    return Observable.throw(body);
  }

}
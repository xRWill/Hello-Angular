import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { tokenNotExpired } from 'angular2-jwt';

import { AuthUser } from '../models/authUser';
import { LocalStorageService } from './../../core/services/localStorage';
import { Service } from './../../core/abstracts/service';

@Injectable()
export class AuthService extends Service {

  protected API_ENDPOINT: string = "user";

  public constructor(
    private http: Http,
    private localStorageService: LocalStorageService
    ) {
    super();
  }

  /**
   * Process the login request to the API.
   */
  public login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post(this.apiEndpoint('login'), { 'email': email, 'password': password }, this.headers)
      .map(res => res.json().data as AuthUser)
      .catch(this.handleError);
  }

  /**
   * Checks if there is a valid token.
   */
  public loggedIn(): boolean {
    // are there a token and is a valid token?
    console.info('are there a valid token? ' + tokenNotExpired('token'));
    return tokenNotExpired('token');
  }

  /**
   * Logs out the user from the API.
   */
  public logout(): Observable<any> {
    this.headers.set('authorization', 'Bearer ' + this.localStorageService.getItem('token'));

    return this.http
      .post(this.apiEndpoint('logout'), {}, { headers: this.headers })
      .map(res => res.json().message)
      .catch(this.handleError);
  }

}

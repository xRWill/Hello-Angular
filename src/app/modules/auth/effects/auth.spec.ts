/* tslint:disable:no-unused-variable */

import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { HttpModule } from '@angular/http';
import  * as routerActions from '@ngrx/router-store/src/actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { AuthUser } from './../models/authUser';
import { AuthEffects } from './auth';
import { AuthService } from './../services/auth.service';
import { LocalStorageService } from './../../core/services/localStorage';
import * as actions from './../actions/auth';

describe('Auth Effects', () => {
  let testbed: TestBed;
  let authService: AuthService;
  let localStorageService: LocalStorageService;
  let runner: EffectsRunner;
  let authEffects: AuthEffects;

  let user = {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@admin.com",
    "confirmed": true,
    "nickname": null,
    "gender": null,
    "birth": null,
    "visitor_id": null,
    "social_auth_provider": null,
    "social_id": null,
    "social_avatar": { "avatar": null, "original": null },
    "created_at": {
      "date": "2016- 12 - 31 04:20:42.000000",
      "timezone_type": 3,
      "timezone": "UTC"
    },
    "token": "test-token-for-the-user",
    "roles": {
      "data": [
        { "object": "Role", "name": "admin", "description": "Super Administrator", "display_name": null }
      ]
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EffectsTestingModule, HttpModule],
      providers: [
        AuthEffects,
        AuthService,
        LocalStorageService,
      ]
    });

    testbed = getTestBed();
    authService = testbed.get(AuthService);
    localStorageService = testbed.get(LocalStorageService);
    runner = testbed.get(EffectsRunner);
    authEffects = testbed.get(AuthEffects);
  }));

  it('should return LOGIN_SUCCESS action on LOGIN success', () => {
    // mock service response
    let response = {
      body: { data: user },
      status: 200
    };

    spyOn(authService, 'login').and.returnValue(Observable.of(response));

    runner.queue(new actions.LoginAction({ email: 'admin@admin.com', password: '123456' }));

    authEffects.logIn$.subscribe(result => {
      expect(authService.login).toHaveBeenCalled();
      expect(result.type).toEqual(actions.ActionTypes.LOGIN_SUCCESS);
    });
  });

  it('should return FLASH_ERROR action on LOGIN error 401', () => {
    // mock service response
    let response = {
      message: 'Credentials Incorrect.',
      status: 401
    };

    spyOn(localStorageService, 'setUser').and.returnValue(null);
    spyOn(authService, 'login').and.returnValue(Observable.throw(response));

    runner.queue(new actions.LoginAction({ email: 'foo', password: 'bar' }));

    authEffects.logIn$.subscribe(result => {
      expect(authService.login).toHaveBeenCalled();
      expect(localStorageService.setUser).not.toHaveBeenCalled();
      expect(result.type).toEqual(actions.ActionTypes.FLASH_ERROR);
    });

  });

  it('should return LOGIN_SUCCESS action if exist user token on storage', () => {
    spyOn(authService, 'loggedIn').and.returnValue(true);

    runner.queue(new actions.LoginFromLocalStorageAction(null));

    authEffects.loginFromLocalStorage$.subscribe(result => {
      expect(authService.loggedIn).toHaveBeenCalled();
      expect(result.type).toEqual(actions.ActionTypes.LOGIN_SUCCESS);
    });
  });

  it('should return LOGOUT_SUCCESS action if not exist user token on storage', () => {
    spyOn(authService, 'loggedIn').and.returnValue(false);

    runner.queue(new actions.LoginFromLocalStorageAction(null));

    authEffects.loginFromLocalStorage$.subscribe(result => {
      expect(authService.loggedIn).toHaveBeenCalled();
      expect(result.type).toEqual(actions.ActionTypes.LOGOUT_SUCCESS);
    });
  });

  it('should return LOGOUT_SUCCESS action', () => {
    let response = {
      message: 'Logout success.',
      status: 200
    };

    spyOn(console, 'info');
    spyOn(authService, 'logout').and.returnValue(Observable.of(response));

    runner.queue(new actions.LogoutAction(null));

    authEffects.logout$.subscribe(result => {
      expect(console.info).toHaveBeenCalled();
      expect(authService.logout).toHaveBeenCalled();
      expect(result.type).toEqual(actions.ActionTypes.LOGOUT_SUCCESS);
    });
  });

  it('should return redirect on LOGOUT_SUCCESS action', () => {
    spyOn(localStorageService, 'removeUser').and.returnValue(null);

    runner.queue(new actions.LogoutSuccessAction(null));

    authEffects.logoutSuccess$.subscribe(result => {
      expect(localStorageService.removeUser).toHaveBeenCalled();
      expect(result.type).toEqual(routerActions.routerActions.GO);
      expect(result.payload.path).toEqual(['/auth/login']);
    });
  });

  it('should redirects on LOGIN_SUCCESS action', () => {
    spyOn(localStorageService, 'setUser').and.returnValue(null);
    spyOn(console, 'info');

    runner.queue(new actions.LoginSuccessAction(user as AuthUser));

    authEffects.loginSuccess$.subscribe(result => {
      expect(localStorageService.setUser).toHaveBeenCalled();
      expect(console.info).toHaveBeenCalled();
      expect(result.type).toEqual(routerActions.routerActions.GO);
      expect(result.payload.path).toEqual(['/welcome']);
    });
  });

});
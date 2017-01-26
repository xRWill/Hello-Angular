/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { SidebarLayoutComponent } from './sidebar-layout.component';
import { UserAccountMenuComponent } from './../../components/user-account-menu/user-account-menu.component';
import { MainSidebarComponent } from './../_partials/main-sidebar/main-sidebar.component';
import * as fromRoot from './../../../../modules/core/reducers';
import * as authActions from './../../../../modules/auth/actions/auth';
import { IMPORTS } from './../../utils';
import { TEST_USER } from './../../../../modules/core/tests/util';

describe('SidebarLayoutComponent', () => {
  let component: SidebarLayoutComponent;
  let fixture: ComponentFixture<SidebarLayoutComponent>;
  let store: Store<fromRoot.State>;
  let user = TEST_USER;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarLayoutComponent, MainSidebarComponent, UserAccountMenuComponent],
      imports: [IMPORTS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarLayoutComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call store to retreive user and layout data', async(() => {
    spyOn(store, 'select');

    component.ngOnInit();
    fixture.detectChanges();

    expect(store.select).toHaveBeenCalledWith(fromRoot.getAuthState);
    expect(store.select).toHaveBeenCalledWith(fromRoot.getShowSidenav);
    expect(store.select).toHaveBeenCalledWith(fromRoot.getShowControlSidebar);
  }));

  it('should hide/show user menu', async(() => {
    // let's begin with the TEST_USER logged in
    store.dispatch(new authActions.LoginSuccessAction(user));
    let userMenuSelector = 'ul[app-admin-lte-user-account-menu]';
    let userMenu;

    component.authState$.subscribe((res) => {
      component.ngOnInit();
      fixture.detectChanges();

      userMenu = fixture.debugElement.query(By.css(userMenuSelector));
      expect(userMenu).not.toBeNull();
    });

    // now the TEST_USER should be logged out
    store.dispatch(new authActions.LogoutSuccessAction(null));
    component.authState$.subscribe((res) => {
      component.ngOnInit();
      fixture.detectChanges();

      userMenu = fixture.debugElement.query(By.css(userMenuSelector));
      expect(userMenu).toBeNull();
    });

  }));

});

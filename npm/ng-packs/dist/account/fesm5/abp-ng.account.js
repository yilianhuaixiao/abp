import {
  ConfigState,
  GetAppConfiguration,
  RestService,
  DynamicLayoutComponent,
  ChangePassword,
  GetProfile,
  UpdateProfile,
  ProfileState,
  SessionState,
  SetTenant,
  CoreModule,
} from '@abp/ng.core';
import { ToasterService, fadeIn, ThemeSharedModule } from '@abp/ng.theme.shared';
import {
  Component,
  Optional,
  Inject,
  Injectable,
  ɵɵdefineInjectable,
  ɵɵinject,
  NgModule,
  InjectionToken,
  Input,
} from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { comparePasswords, NgxValidateCoreModule } from '@ngx-validate/core';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Store, Select } from '@ngxs/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { from, throwError, Observable } from 'rxjs';
import { switchMap, tap, catchError, finalize, take, withLatestFrom } from 'rxjs/operators';
import snq from 'snq';
import { trigger, transition, useAnimation } from '@angular/animations';
import { __read, __decorate, __metadata, __assign } from 'tslib';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var maxLength = Validators.maxLength,
  minLength = Validators.minLength,
  required = Validators.required;
var LoginComponent = /** @class */ (function() {
  function LoginComponent(fb, oauthService, store, toasterService, options) {
    this.fb = fb;
    this.oauthService = oauthService;
    this.store = store;
    this.toasterService = toasterService;
    this.options = options;
    this.oauthService.configure(this.store.selectSnapshot(ConfigState.getOne('environment')).oAuthConfig);
    this.oauthService.loadDiscoveryDocument();
    this.form = this.fb.group({
      username: ['', [required, maxLength(255)]],
      password: ['', [required, maxLength(32)]],
      remember: [false],
    });
  }
  /**
   * @return {?}
   */
  LoginComponent.prototype.onSubmit
  /**
   * @return {?}
   */ = function() {
    var _this = this;
    if (this.form.invalid) return;
    // this.oauthService.setStorage(this.form.value.remember ? localStorage : sessionStorage);
    this.inProgress = true;
    from(
      this.oauthService.fetchTokenUsingPasswordFlow(this.form.get('username').value, this.form.get('password').value),
    )
      .pipe(
        switchMap(
          /**
           * @return {?}
           */
          function() {
            return _this.store.dispatch(new GetAppConfiguration());
          },
        ),
        tap(
          /**
           * @return {?}
           */
          function() {
            /** @type {?} */
            var redirectUrl =
              snq(
                /**
                 * @return {?}
                 */
                (function() {
                  return window.history.state;
                }),
              ).redirectUrl ||
              (_this.options || {}).redirectUrl ||
              '/';
            _this.store.dispatch(new Navigate([redirectUrl]));
          },
        ),
        catchError(
          /**
           * @param {?} err
           * @return {?}
           */
          function(err) {
            _this.toasterService.error(
              snq(
                /**
                 * @return {?}
                 */
                function() {
                  return err.error.error_description;
                },
              ) ||
                snq(
                  /**
                   * @return {?}
                   */
                  function() {
                    return err.error.error.message;
                  },
                  'AbpAccount::DefaultErrorMessage',
                ),
              'Error',
              { life: 7000 },
            );
            return throwError(err);
          },
        ),
        finalize(
          /**
           * @return {?}
           */
          function() {
            return (_this.inProgress = false);
          },
        ),
      )
      .subscribe();
  };
  LoginComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'abp-login',
          template:
            '<abp-auth-wrapper [mainContentRef]="mainContentRef" [cancelContentRef]="cancelContentRef">\n  <ng-template #mainContentRef>\n    <h4>{{ \'AbpAccount::Login\' | abpLocalization }}</h4>\n    <strong>\n      {{ \'AbpAccount::AreYouANewUser\' | abpLocalization }}\n      <a class="text-decoration-none" routerLink="/account/register">{{ \'AbpAccount::Register\' | abpLocalization }}</a>\n    </strong>\n    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="mt-4">\n      <div class="form-group">\n        <label for="login-input-user-name-or-email-address">{{\n          \'AbpAccount::UserNameOrEmailAddress\' | abpLocalization\n        }}</label>\n        <input\n          class="form-control"\n          type="text"\n          id="login-input-user-name-or-email-address"\n          formControlName="username"\n          autofocus\n        />\n      </div>\n      <div class="form-group">\n        <label for="login-input-password">{{ \'AbpAccount::Password\' | abpLocalization }}</label>\n        <input class="form-control" type="password" id="login-input-password" formControlName="password" />\n      </div>\n      <div class="form-check" validationTarget validationStyle>\n        <label class="form-check-label" for="login-input-remember-me">\n          <input class="form-check-input" type="checkbox" id="login-input-remember-me" formControlName="remember" />\n          {{ \'AbpAccount::RememberMe\' | abpLocalization }}\n        </label>\n      </div>\n      <abp-button\n        [loading]="inProgress"\n        buttonType="submit"\n        name="Action"\n        buttonClass="btn-block btn-lg mt-3 btn btn-primary"\n      >\n        {{ \'AbpAccount::Login\' | abpLocalization }}\n      </abp-button>\n    </form>\n  </ng-template>\n  <ng-template #cancelContentRef>\n    <div class="card-footer text-center border-0">\n      <a routerLink="/">\n        <button type="button" name="Action" value="Cancel" class="px-2 py-0 btn btn-link">\n          {{ \'AbpAccount::Cancel\' | abpLocalization }}\n        </button>\n      </a>\n    </div>\n  </ng-template>\n</abp-auth-wrapper>\n',
        },
      ],
    },
  ];
  /** @nocollapse */
  LoginComponent.ctorParameters = function() {
    return [
      { type: FormBuilder },
      { type: OAuthService },
      { type: Store },
      { type: ToasterService },
      { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['ACCOUNT_OPTIONS'] }] },
    ];
  };
  return LoginComponent;
})();
if (false) {
  /** @type {?} */
  LoginComponent.prototype.form;
  /** @type {?} */
  LoginComponent.prototype.inProgress;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.fb;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.oauthService;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.store;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.toasterService;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.options;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ManageProfileComponent = /** @class */ (function() {
  function ManageProfileComponent() {
    this.selectedTab = 0;
  }
  ManageProfileComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'abp-manage-profile',
          template:
            '<div id="AbpContentToolbar"></div>\n\n<div class="card border-0 shadow-sm">\n  <div class="card-body">\n    <div class="row">\n      <div class="col-3">\n        <ul class="nav flex-column nav-pills" id="nav-tab" role="tablist">\n          <li class="nav-item" (click)="selectedTab = 0">\n            <a class="nav-link" [ngClass]="{ active: selectedTab === 0 }" role="tab" href="javascript:void(0)">{{\n              \'AbpUi::ChangePassword\' | abpLocalization\n            }}</a>\n          </li>\n          <li class="nav-item" (click)="selectedTab = 1">\n            <a class="nav-link" [ngClass]="{ active: selectedTab === 1 }" role="tab" href="javascript:void(0)">{{\n              \'AbpAccount::PersonalSettings\' | abpLocalization\n            }}</a>\n          </li>\n        </ul>\n      </div>\n      <div class="col-9">\n        <div class="tab-content" *ngIf="selectedTab === 0" [@fadeIn]>\n          <div class="tab-pane active" role="tabpanel">\n            <h4>\n              {{ \'AbpIdentity::ChangePassword\' | abpLocalization }}\n              <hr />\n            </h4>\n            <abp-change-password-form></abp-change-password-form>\n          </div>\n        </div>\n        <div class="tab-content" *ngIf="selectedTab === 1" [@fadeIn]>\n          <div class="tab-pane active" role="tabpanel">\n            <h4>\n              {{ \'AbpIdentity::PersonalSettings\' | abpLocalization }}\n              <hr />\n            </h4>\n            <abp-personal-settings-form></abp-personal-settings-form>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n',
          animations: [trigger('fadeIn', [transition(':enter', useAnimation(fadeIn))])],
        },
      ],
    },
  ];
  return ManageProfileComponent;
})();
if (false) {
  /** @type {?} */
  ManageProfileComponent.prototype.selectedTab;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AccountService = /** @class */ (function() {
  function AccountService(rest) {
    this.rest = rest;
  }
  /**
   * @param {?} tenantName
   * @return {?}
   */
  AccountService.prototype.findTenant
  /**
   * @param {?} tenantName
   * @return {?}
   */ = function(tenantName) {
    /** @type {?} */
    var request = {
      method: 'GET',
      url: '/api/abp/multi-tenancy/tenants/by-name/' + tenantName,
    };
    return this.rest.request(request);
  };
  /**
   * @param {?} body
   * @return {?}
   */
  AccountService.prototype.register
  /**
   * @param {?} body
   * @return {?}
   */ = function(body) {
    /** @type {?} */
    var request = {
      method: 'POST',
      url: '/api/account/register',
      body: body,
    };
    return this.rest.request(request, { skipHandleError: true });
  };
  AccountService.decorators = [
    {
      type: Injectable,
      args: [
        {
          providedIn: 'root',
        },
      ],
    },
  ];
  /** @nocollapse */
  AccountService.ctorParameters = function() {
    return [{ type: RestService }];
  };
  /** @nocollapse */ AccountService.ngInjectableDef = ɵɵdefineInjectable({
    factory: function AccountService_Factory() {
      return new AccountService(ɵɵinject(RestService));
    },
    token: AccountService,
    providedIn: 'root',
  });
  return AccountService;
})();
if (false) {
  /**
   * @type {?}
   * @private
   */
  AccountService.prototype.rest;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var maxLength$1 = Validators.maxLength,
  minLength$1 = Validators.minLength,
  required$1 = Validators.required,
  email = Validators.email;
var RegisterComponent = /** @class */ (function() {
  function RegisterComponent(fb, accountService, oauthService, store, toasterService) {
    this.fb = fb;
    this.accountService = accountService;
    this.oauthService = oauthService;
    this.store = store;
    this.toasterService = toasterService;
    this.oauthService.configure(this.store.selectSnapshot(ConfigState.getOne('environment')).oAuthConfig);
    this.oauthService.loadDiscoveryDocument();
    this.form = this.fb.group({
      username: ['', [required$1, maxLength$1(255)]],
      password: ['', [required$1, maxLength$1(32)]],
      email: ['', [required$1, email]],
    });
  }
  /**
   * @return {?}
   */
  RegisterComponent.prototype.onSubmit
  /**
   * @return {?}
   */ = function() {
    var _this = this;
    if (this.form.invalid) return;
    this.inProgress = true;
    /** @type {?} */
    var newUser = /** @type {?} */ ({
      userName: this.form.get('username').value,
      password: this.form.get('password').value,
      emailAddress: this.form.get('email').value,
      appName: 'Angular',
    });
    this.accountService
      .register(newUser)
      .pipe(
        switchMap(
          /**
           * @return {?}
           */
          function() {
            return from(_this.oauthService.fetchTokenUsingPasswordFlow(newUser.userName, newUser.password));
          },
        ),
        switchMap(
          /**
           * @return {?}
           */
          function() {
            return _this.store.dispatch(new GetAppConfiguration());
          },
        ),
        tap(
          /**
           * @return {?}
           */
          function() {
            return _this.store.dispatch(new Navigate(['/']));
          },
        ),
        take(1),
        catchError(
          /**
           * @param {?} err
           * @return {?}
           */
          function(err) {
            _this.toasterService.error(
              snq(
                /**
                 * @return {?}
                 */
                function() {
                  return err.error.error_description;
                },
              ) ||
                snq(
                  /**
                   * @return {?}
                   */
                  function() {
                    return err.error.error.message;
                  },
                  'AbpAccount::DefaultErrorMessage',
                ),
              'Error',
              { life: 7000 },
            );
            return throwError(err);
          },
        ),
        finalize(
          /**
           * @return {?}
           */
          function() {
            return (_this.inProgress = false);
          },
        ),
      )
      .subscribe();
  };
  RegisterComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'abp-register',
          template:
            '<abp-auth-wrapper [mainContentRef]="mainContentRef">\n  <ng-template #mainContentRef>\n    <h4>{{ \'AbpAccount::Register\' | abpLocalization }}</h4>\n    <strong>\n      {{ \'AbpAccount::AlreadyRegistered\' | abpLocalization }}\n      <a class="text-decoration-none" routerLink="/account/login">{{ \'AbpAccount::Login\' | abpLocalization }}</a>\n    </strong>\n    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="mt-4">\n      <div class="form-group">\n        <label for="input-user-name">{{ \'AbpAccount::UserName\' | abpLocalization }}</label\n        ><span> * </span\n        ><input autofocus type="text" id="input-user-name" class="form-control" formControlName="username" />\n      </div>\n      <div class="form-group">\n        <label for="input-email-address">{{ \'AbpAccount::EmailAddress\' | abpLocalization }}</label\n        ><span> * </span><input type="email" id="input-email-address" class="form-control" formControlName="email" />\n      </div>\n      <div class="form-group">\n        <label for="input-password">{{ \'AbpAccount::Password\' | abpLocalization }}</label\n        ><span> * </span><input type="password" id="input-password" class="form-control" formControlName="password" />\n      </div>\n      <abp-button\n        [loading]="inProgress"\n        buttonType="submit"\n        name="Action"\n        buttonClass="btn-block btn-lg mt-3 btn btn-primary"\n      >\n        {{ \'AbpAccount::Register\' | abpLocalization }}\n      </abp-button>\n    </form>\n  </ng-template>\n</abp-auth-wrapper>\n',
        },
      ],
    },
  ];
  /** @nocollapse */
  RegisterComponent.ctorParameters = function() {
    return [
      { type: FormBuilder },
      { type: AccountService },
      { type: OAuthService },
      { type: Store },
      { type: ToasterService },
    ];
  };
  return RegisterComponent;
})();
if (false) {
  /** @type {?} */
  RegisterComponent.prototype.form;
  /** @type {?} */
  RegisterComponent.prototype.inProgress;
  /**
   * @type {?}
   * @private
   */
  RegisterComponent.prototype.fb;
  /**
   * @type {?}
   * @private
   */
  RegisterComponent.prototype.accountService;
  /**
   * @type {?}
   * @private
   */
  RegisterComponent.prototype.oauthService;
  /**
   * @type {?}
   * @private
   */
  RegisterComponent.prototype.store;
  /**
   * @type {?}
   * @private
   */
  RegisterComponent.prototype.toasterService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    component: DynamicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      {
        path: 'manage-profile',
        component: ManageProfileComponent,
      },
    ],
  },
];
var AccountRoutingModule = /** @class */ (function() {
  function AccountRoutingModule() {}
  AccountRoutingModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          imports: [RouterModule.forChild(routes)],
          exports: [RouterModule],
        },
      ],
    },
  ];
  return AccountRoutingModule;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var minLength$2 = Validators.minLength,
  required$2 = Validators.required;
/** @type {?} */
var PASSWORD_FIELDS = ['newPassword', 'repeatNewPassword'];
var ChangePasswordComponent = /** @class */ (function() {
  function ChangePasswordComponent(fb, store, toasterService) {
    this.fb = fb;
    this.store = store;
    this.toasterService = toasterService;
    this.mapErrorsFn
    /**
     * @param {?} errors
     * @param {?} groupErrors
     * @param {?} control
     * @return {?}
     */ = function(errors, groupErrors, control) {
      if (PASSWORD_FIELDS.indexOf(control.name) < 0) return errors;
      return errors.concat(
        groupErrors.filter(
          /**
           * @param {?} __0
           * @return {?}
           */
          function(_a) {
            var key = _a.key;
            return key === 'passwordMismatch';
          },
        ),
      );
    };
  }
  /**
   * @return {?}
   */
  ChangePasswordComponent.prototype.ngOnInit
  /**
   * @return {?}
   */ = function() {
    this.form = this.fb.group(
      {
        password: ['', required$2],
        newPassword: ['', required$2],
        repeatNewPassword: ['', required$2],
      },
      {
        validators: [comparePasswords(PASSWORD_FIELDS)],
      },
    );
  };
  /**
   * @return {?}
   */
  ChangePasswordComponent.prototype.onSubmit
  /**
   * @return {?}
   */ = function() {
    var _this = this;
    if (this.form.invalid) return;
    this.inProgress = true;
    this.store
      .dispatch(
        new ChangePassword({
          currentPassword: this.form.get('password').value,
          newPassword: this.form.get('newPassword').value,
        }),
      )
      .pipe(
        finalize(
          /**
           * @return {?}
           */
          function() {
            return (_this.inProgress = false);
          },
        ),
      )
      .subscribe({
        /**
         * @return {?}
         */
        next: function() {
          _this.form.reset();
          _this.toasterService.success('AbpAccount::PasswordChangedMessage', 'Success', { life: 5000 });
        },
        /**
         * @param {?} err
         * @return {?}
         */
        error: function(err) {
          _this.toasterService.error(
            snq(
              /**
               * @return {?}
               */
              function() {
                return err.error.error.message;
              },
              'AbpAccount::DefaultErrorMessage',
            ),
            'Error',
            {
              life: 7000,
            },
          );
        },
      });
  };
  ChangePasswordComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'abp-change-password-form',
          template:
            '<form [formGroup]="form" (ngSubmit)="onSubmit()" [mapErrorsFn]="mapErrorsFn">\n  <div class="form-group">\n    <label for="current-password">{{ \'AbpIdentity::DisplayName:CurrentPassword\' | abpLocalization }}</label\n    ><span> * </span\n    ><input type="password" id="current-password" class="form-control" formControlName="password" autofocus />\n  </div>\n  <div class="form-group">\n    <label for="new-password">{{ \'AbpIdentity::DisplayName:NewPassword\' | abpLocalization }}</label\n    ><span> * </span><input type="password" id="new-password" class="form-control" formControlName="newPassword" />\n  </div>\n  <div class="form-group">\n    <label for="confirm-new-password">{{ \'AbpIdentity::DisplayName:NewPasswordConfirm\' | abpLocalization }}</label\n    ><span> * </span\n    ><input type="password" id="confirm-new-password" class="form-control" formControlName="repeatNewPassword" />\n  </div>\n  <abp-button\n    iconClass="fa fa-check"\n    buttonClass="btn btn-primary color-white"\n    buttonType="submit"\n    [loading]="inProgress"\n    >{{ \'AbpIdentity::Save\' | abpLocalization }}</abp-button\n  >\n</form>\n',
        },
      ],
    },
  ];
  /** @nocollapse */
  ChangePasswordComponent.ctorParameters = function() {
    return [{ type: FormBuilder }, { type: Store }, { type: ToasterService }];
  };
  return ChangePasswordComponent;
})();
if (false) {
  /** @type {?} */
  ChangePasswordComponent.prototype.form;
  /** @type {?} */
  ChangePasswordComponent.prototype.inProgress;
  /** @type {?} */
  ChangePasswordComponent.prototype.mapErrorsFn;
  /**
   * @type {?}
   * @private
   */
  ChangePasswordComponent.prototype.fb;
  /**
   * @type {?}
   * @private
   */
  ChangePasswordComponent.prototype.store;
  /**
   * @type {?}
   * @private
   */
  ChangePasswordComponent.prototype.toasterService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var maxLength$2 = Validators.maxLength,
  required$3 = Validators.required,
  email$1 = Validators.email;
var PersonalSettingsComponent = /** @class */ (function() {
  function PersonalSettingsComponent(fb, store, toasterService) {
    this.fb = fb;
    this.store = store;
    this.toasterService = toasterService;
  }
  /**
   * @return {?}
   */
  PersonalSettingsComponent.prototype.ngOnInit
  /**
   * @return {?}
   */ = function() {
    this.buildForm();
  };
  /**
   * @return {?}
   */
  PersonalSettingsComponent.prototype.buildForm
  /**
   * @return {?}
   */ = function() {
    var _this = this;
    this.store
      .dispatch(new GetProfile())
      .pipe(
        withLatestFrom(this.profile$),
        take(1),
      )
      .subscribe(
        /**
         * @param {?} __0
         * @return {?}
         */
        function(_a) {
          var _b = __read(_a, 2),
            profile = _b[1];
          _this.form = _this.fb.group({
            userName: [profile.userName, [required$3, maxLength$2(256)]],
            email: [profile.email, [required$3, email$1, maxLength$2(256)]],
            name: [profile.name || '', [maxLength$2(64)]],
            surname: [profile.surname || '', [maxLength$2(64)]],
            phoneNumber: [profile.phoneNumber || '', [maxLength$2(16)]],
          });
        },
      );
  };
  /**
   * @return {?}
   */
  PersonalSettingsComponent.prototype.submit
  /**
   * @return {?}
   */ = function() {
    var _this = this;
    if (this.form.invalid) return;
    this.inProgress = true;
    this.store
      .dispatch(new UpdateProfile(this.form.value))
      .pipe(
        finalize(
          /**
           * @return {?}
           */
          function() {
            return (_this.inProgress = false);
          },
        ),
      )
      .subscribe(
        /**
         * @return {?}
         */
        function() {
          _this.toasterService.success('AbpAccount::PersonalSettingsSaved', 'Success', { life: 5000 });
        },
      );
  };
  PersonalSettingsComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'abp-personal-settings-form',
          template:
            '<form novalidate *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">\n  <div class="form-group">\n    <label for="username">{{ \'AbpIdentity::DisplayName:UserName\' | abpLocalization }}</label\n    ><span> * </span\n    ><input\n      type="text"\n      id="username"\n      class="form-control"\n      formControlName="userName"\n      autofocus\n      (keydown.space)="$event.preventDefault()"\n    />\n  </div>\n  <div class="row">\n    <div class="col col-md-6">\n      <div class="form-group">\n        <label for="name">{{ \'AbpIdentity::DisplayName:Name\' | abpLocalization }}</label\n        ><input type="text" id="name" class="form-control" formControlName="name" />\n      </div>\n    </div>\n    <div class="col col-md-6">\n      <div class="form-group">\n        <label for="surname">{{ \'AbpIdentity::DisplayName:Surname\' | abpLocalization }}</label\n        ><input type="text" id="surname" class="form-control" formControlName="surname" />\n      </div>\n    </div>\n  </div>\n  <div class="form-group">\n    <label for="email-address">{{ \'AbpIdentity::DisplayName:Email\' | abpLocalization }}</label\n    ><span> * </span><input type="text" id="email-address" class="form-control" formControlName="email" />\n  </div>\n  <div class="form-group">\n    <label for="phone-number">{{ \'AbpIdentity::DisplayName:PhoneNumber\' | abpLocalization }}</label\n    ><input type="text" id="phone-number" class="form-control" formControlName="phoneNumber" />\n  </div>\n  <abp-button\n    buttonType="submit"\n    iconClass="fa fa-check"\n    buttonClass="btn btn-primary color-white"\n    [loading]="inProgress"\n  >\n    {{ \'AbpIdentity::Save\' | abpLocalization }}</abp-button\n  >\n</form>\n',
        },
      ],
    },
  ];
  /** @nocollapse */
  PersonalSettingsComponent.ctorParameters = function() {
    return [{ type: FormBuilder }, { type: Store }, { type: ToasterService }];
  };
  __decorate(
    [Select(ProfileState.getProfile), __metadata('design:type', Observable)],
    PersonalSettingsComponent.prototype,
    'profile$',
    void 0,
  );
  return PersonalSettingsComponent;
})();
if (false) {
  /** @type {?} */
  PersonalSettingsComponent.prototype.profile$;
  /** @type {?} */
  PersonalSettingsComponent.prototype.form;
  /** @type {?} */
  PersonalSettingsComponent.prototype.inProgress;
  /**
   * @type {?}
   * @private
   */
  PersonalSettingsComponent.prototype.fb;
  /**
   * @type {?}
   * @private
   */
  PersonalSettingsComponent.prototype.store;
  /**
   * @type {?}
   * @private
   */
  PersonalSettingsComponent.prototype.toasterService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var TenantBoxComponent = /** @class */ (function() {
  function TenantBoxComponent(store, toasterService, accountService) {
    this.store = store;
    this.toasterService = toasterService;
    this.accountService = accountService;
    this.tenant = /** @type {?} */ ({});
  }
  /**
   * @return {?}
   */
  TenantBoxComponent.prototype.ngOnInit
  /**
   * @return {?}
   */ = function() {
    this.tenant = this.store.selectSnapshot(SessionState.getTenant) || /** @type {?} */ ({});
    this.tenantName = this.tenant.name || '';
  };
  /**
   * @return {?}
   */
  TenantBoxComponent.prototype.onSwitch
  /**
   * @return {?}
   */ = function() {
    this.isModalVisible = true;
  };
  /**
   * @return {?}
   */
  TenantBoxComponent.prototype.save
  /**
   * @return {?}
   */ = function() {
    var _this = this;
    if (this.tenant.name) {
      this.accountService
        .findTenant(this.tenant.name)
        .pipe(
          take(1),
          catchError(
            /**
             * @param {?} err
             * @return {?}
             */
            function(err) {
              _this.toasterService.error(
                snq(
                  /**
                   * @return {?}
                   */
                  function() {
                    return err.error.error_description;
                  },
                  'AbpUi::DefaultErrorMessage',
                ),
                'AbpUi::Error',
              );
              return throwError(err);
            },
          ),
        )
        .subscribe(
          /**
           * @param {?} __0
           * @return {?}
           */
          function(_a) {
            var success = _a.success,
              tenantId = _a.tenantId;
            if (success) {
              _this.tenant = {
                id: tenantId,
                name: _this.tenant.name,
              };
              _this.tenantName = _this.tenant.name;
              _this.isModalVisible = false;
            } else {
              _this.toasterService.error('AbpUiMultiTenancy::GivenTenantIsNotAvailable', 'AbpUi::Error', {
                messageLocalizationParams: [_this.tenant.name],
              });
              _this.tenant = /** @type {?} */ ({});
            }
            _this.store.dispatch(new SetTenant(success ? _this.tenant : null));
          },
        );
    } else {
      this.store.dispatch(new SetTenant(null));
      this.tenantName = null;
      this.isModalVisible = false;
    }
  };
  TenantBoxComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'abp-tenant-box',
          template:
            '<div class="card shadow-sm rounded mb-3">\n  <div class="card-body px-5">\n    <div class="row">\n      <div class="col">\n        <span style="font-size: 0.8em;" class="text-uppercase text-muted">{{\n          \'AbpUiMultiTenancy::Tenant\' | abpLocalization\n        }}</span\n        ><br />\n        <h6 class="m-0 d-inline-block">\n          <span>\n            {{ tenantName || (\'AbpUiMultiTenancy::NotSelected\' | abpLocalization) }}\n          </span>\n        </h6>\n      </div>\n      <div class="col-auto">\n        <a\n          id="AbpTenantSwitchLink"\n          href="javascript:void(0);"\n          class="btn btn-sm mt-3 btn-outline-primary"\n          (click)="onSwitch()"\n          >{{ \'AbpUiMultiTenancy::Switch\' | abpLocalization }}</a\n        >\n      </div>\n    </div>\n  </div>\n</div>\n\n<abp-modal [(visible)]="isModalVisible" size="md">\n  <ng-template #abpHeader>\n    <h5>Switch Tenant</h5>\n  </ng-template>\n  <ng-template #abpBody>\n    <form (ngSubmit)="save()">\n      <div class="mt-2">\n        <div class="form-group">\n          <label for="name">{{ \'AbpUiMultiTenancy::Name\' | abpLocalization }}</label>\n          <input [(ngModel)]="tenant.name" type="text" id="name" name="tenant" class="form-control" autofocus />\n        </div>\n        <p>{{ \'AbpUiMultiTenancy::SwitchTenantHint\' | abpLocalization }}</p>\n      </div>\n    </form>\n  </ng-template>\n  <ng-template #abpFooter>\n    <button #abpClose type="button" class="btn btn-secondary">\n      {{ \'AbpTenantManagement::Cancel\' | abpLocalization }}\n    </button>\n    <button type="button" class="btn btn-primary" (click)="save()">\n      <i class="fa fa-check mr-1"></i> <span>{{ \'AbpTenantManagement::Save\' | abpLocalization }}</span>\n    </button>\n  </ng-template>\n</abp-modal>\n',
        },
      ],
    },
  ];
  /** @nocollapse */
  TenantBoxComponent.ctorParameters = function() {
    return [{ type: Store }, { type: ToasterService }, { type: AccountService }];
  };
  return TenantBoxComponent;
})();
if (false) {
  /** @type {?} */
  TenantBoxComponent.prototype.tenant;
  /** @type {?} */
  TenantBoxComponent.prototype.tenantName;
  /** @type {?} */
  TenantBoxComponent.prototype.isModalVisible;
  /**
   * @type {?}
   * @private
   */
  TenantBoxComponent.prototype.store;
  /**
   * @type {?}
   * @private
   */
  TenantBoxComponent.prototype.toasterService;
  /**
   * @type {?}
   * @private
   */
  TenantBoxComponent.prototype.accountService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?} options
 * @return {?}
 */
function optionsFactory(options) {
  return __assign({ redirectUrl: '/' }, options);
}
/** @type {?} */
var ACCOUNT_OPTIONS = new InjectionToken('ACCOUNT_OPTIONS');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AuthWrapperComponent = /** @class */ (function() {
  function AuthWrapperComponent() {}
  AuthWrapperComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'abp-auth-wrapper',
          template:
            '<div class="row">\n  <div class="mx-auto col col-md-5">\n    <abp-tenant-box></abp-tenant-box>\n\n    <div class="abp-account-container">\n      <div class="card mt-3 shadow-sm rounded">\n        <div class="card-body p-5">\n          <ng-content *ngTemplateOutlet="mainContentRef"></ng-content>\n        </div>\n        <ng-content *ngTemplateOutlet="cancelContentRef"></ng-content>\n      </div>\n    </div>\n  </div>\n</div>\n',
        },
      ],
    },
  ];
  AuthWrapperComponent.propDecorators = {
    mainContentRef: [{ type: Input }],
    cancelContentRef: [{ type: Input }],
  };
  return AuthWrapperComponent;
})();
if (false) {
  /** @type {?} */
  AuthWrapperComponent.prototype.mainContentRef;
  /** @type {?} */
  AuthWrapperComponent.prototype.cancelContentRef;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AccountModule = /** @class */ (function() {
  function AccountModule() {}
  AccountModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          declarations: [
            AuthWrapperComponent,
            LoginComponent,
            RegisterComponent,
            TenantBoxComponent,
            ChangePasswordComponent,
            ManageProfileComponent,
            PersonalSettingsComponent,
          ],
          imports: [
            CoreModule,
            AccountRoutingModule,
            ThemeSharedModule,
            TableModule,
            NgbDropdownModule,
            NgxValidateCoreModule,
          ],
          exports: [],
        },
      ],
    },
  ];
  return AccountModule;
})();
/**
 *
 * @deprecated since version 0.9
 * @param {?=} options
 * @return {?}
 */
function AccountProviders(options) {
  if (options === void 0) {
    options = /** @type {?} */ ({});
  }
  return [
    { provide: ACCOUNT_OPTIONS, useValue: options },
    {
      provide: 'ACCOUNT_OPTIONS',
      useFactory: optionsFactory,
      deps: [ACCOUNT_OPTIONS],
    },
  ];
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 * @deprecated since version 0.9
 * @type {?}
 */
var ACCOUNT_ROUTES = {
  routes: /** @type {?} */ ([
    {
      name: 'Account',
      path: 'account',
      invisible: true,
      layout: 'application' /* application */,
      children: [{ path: 'login', name: 'Login', order: 1 }, { path: 'register', name: 'Register', order: 2 }],
    },
  ]),
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function Options() {}
if (false) {
  /** @type {?|undefined} */
  Options.prototype.redirectUrl;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function RegisterRequest() {}
if (false) {
  /** @type {?} */
  RegisterRequest.prototype.userName;
  /** @type {?} */
  RegisterRequest.prototype.emailAddress;
  /** @type {?} */
  RegisterRequest.prototype.password;
  /** @type {?|undefined} */
  RegisterRequest.prototype.appName;
}
/**
 * @record
 */
function RegisterResponse() {}
if (false) {
  /** @type {?} */
  RegisterResponse.prototype.tenantId;
  /** @type {?} */
  RegisterResponse.prototype.userName;
  /** @type {?} */
  RegisterResponse.prototype.name;
  /** @type {?} */
  RegisterResponse.prototype.surname;
  /** @type {?} */
  RegisterResponse.prototype.email;
  /** @type {?} */
  RegisterResponse.prototype.emailConfirmed;
  /** @type {?} */
  RegisterResponse.prototype.phoneNumber;
  /** @type {?} */
  RegisterResponse.prototype.phoneNumberConfirmed;
  /** @type {?} */
  RegisterResponse.prototype.twoFactorEnabled;
  /** @type {?} */
  RegisterResponse.prototype.lockoutEnabled;
  /** @type {?} */
  RegisterResponse.prototype.lockoutEnd;
  /** @type {?} */
  RegisterResponse.prototype.concurrencyStamp;
  /** @type {?} */
  RegisterResponse.prototype.isDeleted;
  /** @type {?} */
  RegisterResponse.prototype.deleterId;
  /** @type {?} */
  RegisterResponse.prototype.deletionTime;
  /** @type {?} */
  RegisterResponse.prototype.lastModificationTime;
  /** @type {?} */
  RegisterResponse.prototype.lastModifierId;
  /** @type {?} */
  RegisterResponse.prototype.creationTime;
  /** @type {?} */
  RegisterResponse.prototype.creatorId;
  /** @type {?} */
  RegisterResponse.prototype.id;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function TenantIdResponse() {}
if (false) {
  /** @type {?} */
  TenantIdResponse.prototype.success;
  /** @type {?} */
  TenantIdResponse.prototype.tenantId;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export {
  ACCOUNT_OPTIONS,
  ACCOUNT_ROUTES,
  AccountModule,
  AccountProviders,
  ChangePasswordComponent,
  LoginComponent,
  ManageProfileComponent,
  PersonalSettingsComponent,
  RegisterComponent,
  optionsFactory,
  AuthWrapperComponent as ɵa,
  LoginComponent as ɵb,
  RegisterComponent as ɵd,
  AccountService as ɵe,
  TenantBoxComponent as ɵf,
  ChangePasswordComponent as ɵg,
  ManageProfileComponent as ɵh,
  PersonalSettingsComponent as ɵi,
  AccountRoutingModule as ɵj,
  optionsFactory as ɵk,
  ACCOUNT_OPTIONS as ɵl,
};
//# sourceMappingURL=abp-ng.account.js.map
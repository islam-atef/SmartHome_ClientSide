import { Injectable } from '@angular/core';
import { AuthApiService } from '../data-access/auth-api.service';
import { TokenStoreService } from '../../../core/auth/tokenStoreService/token-store.service';
import { BrowserIdStoreService } from '../../../core/browserIdentifier/browserIdStoreService/browser-id-store-service';
import { AuthStateService } from '../../../core/auth/authStateService/auth-state.service';
import { AuthResponseDto } from '../models/auth-response.dto';
import { AuthTokenModel } from '../../../core/auth/auth-token-model';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { LoginRequestDto } from '../models/login-request.dto';
import { LoginResultDto } from '../models/login-result.dto';
import { OtpAnswerDto } from '../models/otp-answer.dto';
import { BrowserIdentifierModel } from '../../../core/browserIdentifier/browser-Identifier-Model';
import { BrowserIdStateService } from '../../../core/browserIdentifier/browserIdStateService/browser-id-state.service';
import { ResetPasswordDto } from '../models/reset-password.dto';
import { RegisterDto } from '../models/register.dto';
import { E } from '@angular/cdk/keycodes';
import { AccountActivationDto } from '../models/account-activation.dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthFacadeService {
  constructor(
    private authApi: AuthApiService,
    private authState: AuthStateService,
    private browserIdState: BrowserIdStateService,
    private tokenStore: TokenStoreService,
    private browserIdStore: BrowserIdStoreService,
    private router: Router
  ) {}

  //#region: Authentication Initialization from Local Storage method
  initFromLocalStorage() {
    const tokenStored = this.tokenStore.getTokens();
    const browserIdStored = this.browserIdStore.getBrowserId();
    const activationFlagStored = this.getActivationFlagFromStorage();

    if (tokenStored) {
      this.authState.setTokens(tokenStored);
    }
    if (browserIdStored) {
      this.browserIdState.setIdentifier(browserIdStored);
    }
    if (activationFlagStored) {
      this._account_activation_PageAccessFlag.next(true);
    }
  }
  //#endregion

  //#region: Authentication login and logout methods
  login(dto: LoginRequestDto): Observable<LoginResultDto> {
    return this.authApi.beginLogin(dto).pipe(
      map((res: AuthResponseDto | null | string) => {
        if (!res || typeof res === 'string') {
          return {
            isSuccess: false,
            isOtpSent: false,
            otpQuestionId: null,
            errors: res || 'An unexpected error occurred',
          } as LoginResultDto;
        }
        if (res.accessToken && res.refreshToken) {
          // successful login
          // apply the received tokens
          this.applyTokens(res);
          return {
            isSuccess: true,
            isOtpSent: false,
            otpQuestionId: null,
            errors: null,
          } as LoginResultDto;
        } else if (res.otpQuestionId) {
          // the Browser not Authenticated
          return {
            isSuccess: false,
            isOtpSent: true,
            otpQuestionId: res.otpQuestionId,
            errors: 'Check your email for the OTP code',
          } as LoginResultDto;
        }
        return {
          isSuccess: false,
          isOtpSent: false,
          otpQuestionId: null,
          errors: 'An unexpected error occurred',
        } as LoginResultDto;
      }),
      tap((result) => {
        console.log(
          'AuthFacadeService: Login: Login result in the facade service:',
          result
        );
      }),
      catchError((error) => {
        console.error(
          'AuthFacadeService: Login: Login error in the facade service:',
          error
        );
        return of({
          isSuccess: false,
          isOtpSent: false,
          otpQuestionId: null,
          errors: error?.message || 'An unexpected error occurred',
        } as LoginResultDto);
      })
    );
  }

  logout(email: string) {
    let token = this.authState.getTokensSnapshot();
    if (!token?.refreshToken) {
      console.log(
        'AuthFacadeService: logout: No refresh token found, cannot logout'
      );
      return EMPTY;
    }
    this.authApi.logout(token.refreshToken, email).subscribe({
      next: (result) => {
        if (result) {
          console.log(
            'AuthFacadeService: logout: User logged out successfully'
          );
          this.tokenStore.clearTokens();
          this.authState.setTokens(null);
          this.router.navigate(['/authentication/login']);
        } else {
          console.log('AuthFacadeService: logout: Logout failed');
        }
      },
      error: (error) => {
        console.error(
          'AuthFacadeService: logout: Logout error in the facade service:',
          error
        );
      },
    });
    return EMPTY;
  }
  //#endregion

  //#region: password management methods
  private _reset_password_PageAccessFlag = new BehaviorSubject<boolean>(
    this.getResetPWFlagFromStorage()
  );
  reset_password_PageAccessFlag$ =
    this._reset_password_PageAccessFlag.asObservable();

  private getResetPWFlagFromStorage(): boolean {
    const stored = localStorage.getItem('account_activation_flag');
    console.log(
      'AuthFacadeService: getResetPWFlagFromStorage: Stored Flag is:',
      stored
    );
    return stored === 'true'; // Returns TRUE if localStorage has 'true', FALSE if null or anything else
  }

  private saveResetPWFlagToStorage(value: boolean): void {
    localStorage.setItem('account_activation_flag', value.toString());
  }

  reset_password_PageAccessFlag(value: boolean) {
    this._reset_password_PageAccessFlag.next(value);
    this.saveResetPWFlagToStorage(value);
    console.log(
      'AuthFacadeService: reset_password_PageAccessFlag: Flag set to',
      value
    );
  }

  sendForgotPWMail(email: string): Observable<boolean> {
    return this.authApi.forgotPassword(email).pipe(
      map((res) => true),
      tap((success) => {
        if (success) {
          console.log(
            'AuthFacadeService: sendForgotPWMail: Password reset email sent'
          );
          this.reset_password_PageAccessFlag(true);
        }
      }),
      catchError((error) => {
        console.error(
          'AuthFacadeService: sendForgotPWMail: Password reset email has as error in the facade service:',
          error
        );
        return of(false);
      })
    );
  }

  resetPassword(dto: ResetPasswordDto): Observable<boolean> {
    return this.authApi.resetPassword(dto).pipe(
      map((res) => !!res),
      // 2) Log based on the boolean result
      tap((success) => {
        if (success) {
          console.log(
            'AuthFacadeService: resetPassword: Password reset successful'
          );
        } else {
          console.log(
            'AuthFacadeService: resetPassword: Password reset failed'
          );
        }
        this.reset_password_PageAccessFlag(false);
      }),
      catchError((error) => {
        console.error(
          'AuthFacadeService: resetPassword: Password reset error in the facade service:',
          error
        );
        return of(false);
      })
    );
  }
  //#endregion

  //#region: Registration management methods
  private _account_activation_PageAccessFlag = new BehaviorSubject<boolean>(
    this.getActivationFlagFromStorage()
  );
  account_activation_PageAccessFlag$ =
    this._account_activation_PageAccessFlag.asObservable();

  private getActivationFlagFromStorage(): boolean {
    const stored = localStorage.getItem('account_activation_flag');
    console.log(
      'AuthFacadeService: getActivationFlagFromStorage: Stored Flag is:',
      stored
    );
    return stored === 'true'; // Returns TRUE if localStorage has 'true', FALSE if null or anything else
  }

  private saveActivationFlagToStorage(value: boolean): void {
    localStorage.setItem('account_activation_flag', value.toString());
  }

  account_activation_PageAccessFlag(value: boolean) {
    this._account_activation_PageAccessFlag.next(value);
    this.saveActivationFlagToStorage(value);
    console.log(
      'AuthFacadeService: account_activation_PageAccessFlag: Flag set to',
      value
    );
  }

  register(dto: RegisterDto): Observable<boolean> {
    return this.authApi.register(dto).pipe(
      map((res) => !!res),
      // 2) Log based on the boolean result
      tap((success) => {
        if (success) {
          console.log('AuthFacadeService: register: Registration successful');
          this.account_activation_PageAccessFlag(true);
        } else {
          console.log('AuthFacadeService: register: Registration failed');
        }
      }),
      catchError((error: any) => {
        console.error(
          'AuthFacadeService: register: Registration error in the facade service:',
          error
        );
        return of(false);
      })
    );
  }

  accountActivation(dto: AccountActivationDto): Observable<boolean> {
    return this.authApi.accountActivation(dto).pipe(
      map((res) => !!res),
      // 2) Log based on the boolean result
      tap((success) => {
        if (success) {
          console.log(
            'AuthFacadeService: accountActivation: Account activation successful'
          );
          this.account_activation_PageAccessFlag(false);
        } else {
          console.log(
            'AuthFacadeService: accountActivation: Account activation failed'
          );
        }
      }),
      catchError((error: any) => {
        console.error(
          'AuthFacadeService: accountActivation: Account activation error in the facade service:',
          error
        );
        return of(false);
      })
    );
  }
  //#endregion

  //#region: Token management methods
  refresh() {
    // If there is no refresh token, do nothing
    const t = this.tokenStore.getTokens();

    if (!t?.refreshToken) {
      console.log('AuthFacadeService: refresh: No refresh token found');
      return EMPTY;
    }
    console.log('AuthFacadeService: refresh: current tokens', t);
    return this.authApi.refresh(t.refreshToken).pipe(
      map((res) => res),
      tap((res) => {
        console.log('AuthFacadeService: refresh: refresh result', res);
        // If the response is null or missing either the access token or refresh token, do nothing
        if (!res || !res.accessToken || !res.refreshToken) {
          this.authState.setTokens(null);
          return;
        }
        // else, apply the response to the token store and auth state
        this.tokenStore.saveTokens(res);
        this.authState.setTokens(res);
      }),
      catchError((error: any) => {
        console.error('AuthFacadeService: refresh: error', error);
        return of(null);
      })
    );
  }
  //#endregion

  //#region: User Identifier check methods
  checkByEmail(email: string): Observable<boolean> {
    return this.authApi.checkEmail(email).pipe(
      map((res) => !!res),
      tap((res) =>
        console.log(`AuthFacadeService: checkByEmail: Email exists: ${res}`)
      ),
      catchError((error: any) => of(false))
    );
  }

  checkByUsername(username: string): Observable<boolean> {
    return this.authApi.checkUsername(username).pipe(
      map((res) => !!res),
      tap((res) =>
        console.log(
          `AuthFacadeService: checkByUsername: Username exists: ${res}`
        )
      ),
      catchError((error: any) => of(false))
    );
  }
  //#endregion

  //#region: Browser Identifier methods
  sendOtp(answer: OtpAnswerDto): Observable<boolean> {
    if (!answer) return EMPTY;
    return this.authApi.verifyOtp(answer).pipe(
      map((res) => {
        if (res == null) return false;
        this.tokenStore.saveTokens(res);
        this.authState.setTokens(res);
        return true;
      })
    );
  }

  UpdateBrowserId(): Observable<boolean> {
    let newBrowserIdentifier = new BrowserIdentifierModel();
    return this.authApi.updateBrowserId(newBrowserIdentifier.browserId).pipe(
      map((res) => {
        if (res == null) {
          console.error(
            'AuthFacadeService: UpdateBrowserId: Error updating browser id'
          );
          return false;
        }
        this.browserIdStore.saveBrowserId(newBrowserIdentifier);
        this.browserIdState.setIdentifier(newBrowserIdentifier);
        console.log('AuthFacadeService: UpdateBrowserId: Browser id updated');
        return true;
      })
    );
  }
  //#endregion

  //#region: Token application methods
  private applyTokens(res: AuthResponseDto) {
    if (!res || !res.accessToken || !res.refreshToken) return;
    const tokens: AuthTokenModel = {
      accessToken: res.accessToken!,
      refreshToken: res.refreshToken!,
      expiresAtUtc: res.expiresAtUtc!,
    };
    console.log('AuthFacadeService: applyTokens: applying tokens:', tokens);
    this.tokenStore.saveTokens(tokens);
    this.authState.setTokens(tokens);
  }

  changeTokens(tokens: AuthTokenModel | null) {
    if (!tokens) {
      this.tokenStore.clearTokens();
      this.authState.setTokens(null);
      console.log('AuthFacadeService: changeTokens: Tokens cleared');
      return;
    }
    this.tokenStore.saveTokens(tokens);
    this.authState.setTokens(tokens);
    console.log('AuthFacadeService: changeTokens: Tokens updated');
  }
  //#endregion
}

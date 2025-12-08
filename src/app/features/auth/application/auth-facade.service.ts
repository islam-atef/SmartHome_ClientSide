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

@Injectable({
  providedIn: 'root',
})
export class AuthFacadeService {
  constructor(
    private authApi: AuthApiService,
    private authState: AuthStateService,
    private browserIdState: BrowserIdStateService,
    private tokenStore: TokenStoreService,
    private browserIdStore: BrowserIdStoreService
  ) {}

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

  /*******************************/
  /* Authentication main methods */
  /*******************************/

  login(dto: LoginRequestDto): Observable<LoginResultDto> {
    return this.authApi.beginLogin(dto).pipe(
      map(
        (res) => {
          if (!res || typeof res === 'string') {
            return {
              isSuccess: false,
              isOtpSent: false,
              otpQuestionId: null,
              errors: res || 'An unexpected error occurred',
            } as LoginResultDto;
          }
          if (res.accessToken && res.refreshToken) {
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
        },
        catchError((error) => {
          console.error('Login error in the facade service:', error);
          return of({
            isSuccess: false,
            isOtpSent: false,
            otpQuestionId: null,
            errors: error?.message || 'An unexpected error occurred',
          } as LoginResultDto);
        })
      )
    );
  }

  logout() {
    return this.authApi
      .logout(this.tokenStore.getTokens()?.refreshToken || '')
      .pipe(
        tap(() => {
          this.authState.setTokens(null);
          this.tokenStore.clearTokens();
        })
      );
  }

  /*******************************/
  /* password management methods */
  /*******************************/
  private _reset_password_PageAccessFlag = new BehaviorSubject<boolean>(
    this.getResetPWFlagFromStorage()
  );
  reset_password_PageAccessFlag$ =
    this._reset_password_PageAccessFlag.asObservable();

  private getResetPWFlagFromStorage(): boolean {
    const stored = localStorage.getItem('account_activation_flag');
    return stored === 'true'; // Returns TRUE if localStorage has 'true', FALSE if null or anything else
  }

  private saveResetPWFlagToStorage(value: boolean): void {
    localStorage.setItem('account_activation_flag', value.toString());
  }

  reset_password_PageAccessFlag(value: boolean) {
    this._reset_password_PageAccessFlag.next(value);
    this.saveResetPWFlagToStorage(value);
  }

  sendForgotPWMail(email: string): Observable<boolean> {
    return this.authApi.forgotPassword(email).pipe(
      map((res) => true),
      tap((success) => {
        if (success) {
          this.reset_password_PageAccessFlag(true);
        }
      }),
      catchError((error) => {
        console.error('Password reset error in the facade service:', error);
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
          console.log('Password reset successful');
        } else {
          console.log('Password reset failed');
        }
        this.reset_password_PageAccessFlag(false);
      }),
      catchError((error) => {
        console.error('Password reset error in the facade service:', error);
        return of(false);
      })
    );
  }

  /***********************************/
  /* Registration management methods */
  /***********************************/
  private _account_activation_PageAccessFlag = new BehaviorSubject<boolean>(
    this.getActivationFlagFromStorage()
  );
  account_activation_PageAccessFlag$ =
    this._account_activation_PageAccessFlag.asObservable();

  private getActivationFlagFromStorage(): boolean {
    const stored = localStorage.getItem('account_activation_flag');
    return stored === 'true'; // Returns TRUE if localStorage has 'true', FALSE if null or anything else
  }

  private saveActivationFlagToStorage(value: boolean): void {
    localStorage.setItem('account_activation_flag', value.toString());
  }

  account_activation_PageAccessFlag(value: boolean) {
    this._account_activation_PageAccessFlag.next(value);
    this.saveActivationFlagToStorage(value);
  }

  register(dto: RegisterDto): Observable<boolean> {
    return this.authApi.register(dto).pipe(
      map((res) => !!res),
      // 2) Log based on the boolean result
      tap((success) => {
        if (success) {
          console.log('Registration successful');
          this.account_activation_PageAccessFlag(true);
          this.account_activation_PageAccessFlag$.subscribe((value) => {
            console.log(value);
            // Handle the value here
          });
        } else {
          console.log('Registration failed');
        }
      }),
      catchError((error: any) => {
        console.error('Registration error in the facade service:', error);
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
          console.log('Account activation successful');
          this.account_activation_PageAccessFlag(false);
          this.account_activation_PageAccessFlag$.subscribe((value) => {
            console.log(value);
            // Handle the value here
          });
          this.account_activation_PageAccessFlag$.subscribe((value) => {
            console.log(value);
            // Handle the value here
          });
        } else {
          console.log('Account activation failed');
        }
      }),
      catchError((error: any) => {
        console.error('Account activation error in the facade service:', error);
        return of(false);
      })
    );
  }

  /****************************/
  /* Token management methods */
  /****************************/

  refresh() {
    // If there is no refresh token, do nothing
    const t = this.tokenStore.getTokens();
    if (!t?.refreshToken) return EMPTY;

    return this.authApi.refresh(t.refreshToken).pipe(
      tap((res) => {
        // If the response is null or missing either the access token or refresh token, do nothing
        if (!res || !res.accessToken || !res.refreshToken) {
          this.authState.setTokens(null);
          return;
        }
        // else, apply the response to the token store and auth state
        this.tokenStore.saveTokens(res);
        this.authState.setTokens(res);
      })
    );
  }

  /*********************************/
  /* User Identifier check methods */
  /*********************************/
  checkByEmail(email: string): Observable<boolean> {
    return this.authApi.checkEmail(email).pipe(
      map((res) => !!res),
      tap((res) => console.log(res)),
      catchError((error: any) => of(false))
    );
  }

  checkByUsername(username: string): Observable<boolean> {
    return this.authApi.checkUsername(username).pipe(
      map((res) => !!res),
      tap((res) => console.log(res)),
      catchError((error: any) => of(false))
    );
  }

  /******************************/
  /* Browser Identifier methods */
  /******************************/
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
          console.log('Error updating browser id');
          return false;
        }
        this.browserIdStore.saveBrowserId(newBrowserIdentifier);
        this.browserIdState.setIdentifier(newBrowserIdentifier);
        console.log('Browser id updated');
        return true;
      })
    );
  }

  private applyTokens(res: AuthResponseDto) {
    if (!res || !res.accessToken || !res.refreshToken) return;
    const tokens: AuthTokenModel = {
      accessToken: res.accessToken!,
      refreshToken: res.refreshToken!,
      expiresAtUtc: res.expireAtUtc!,
    };
    this.tokenStore.saveTokens(tokens);
    this.authState.setTokens(tokens);
  }
}

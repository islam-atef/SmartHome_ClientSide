import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { LoginRequestDto } from '../models/login-request.dto';
import { AuthResponseDto } from '../models/auth-response.dto';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthTokenModel } from '../../../core/auth/auth-token-model';
import { environment } from '../../../../environments/environment.development';
import { OtpAnswerDto } from '../models/otp-answer.dto';
import { ResetPasswordDto } from '../models/reset-password.dto';
import { RegisterDto } from '../models/register.dto';
import { AccountActivationDto } from '../models/account-activation.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  // verifyOtp() / refresh() / logout()
  constructor(private apiHttp: ApiHttpService) {}

  /**
   * Begins the login process using the provided email and password.
   * @param data A LoginRequestDto containing the email and password to be used for login.
   * @returns An observable that resolves to an AuthResponseDto if the login is successful or null if the input is invalid.
   */
  beginLogin(
    data: LoginRequestDto
  ): Observable<AuthResponseDto | null | string> {
    if (!data || !data.email || !data.password) return of(null);
    const url = 'Auth/login';
    // send login request with email and password
    return this.apiHttp
      .post<AuthResponseDto>(url, {
        email: data.email,
        password: data.password,
      })
      .pipe(
        map((res) => res ?? null),
        catchError((error) => {
          // handle the error here
          if (error.status === 400 || error.status === 401) {
            return of('Invalid email or password');
          }
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  /**
   * Refreshes the access and refresh tokens using the provided refresh token.
   * @param refreshToken The refresh token to be used for refreshing.
   * @returns An observable that resolves to the refreshed access and refresh tokens or null if the refresh token is invalid.
   */
  refresh(refreshToken: string): Observable<AuthTokenModel | null> {
    if (!refreshToken) return of(null);
    const body = { refreshToken: refreshToken };
    const url = 'Auth/refresh-token';
    return this.apiHttp.post<AuthTokenModel>(url, body).pipe(
      map((res) =>
        res != null
          ? ({
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
              expiresAtUtc: res.expiresAtUtc,
            } as AuthTokenModel)
          : null
      )
    );
  }

  /**
   * Logs out the user using the provided refresh token.
   * If the refresh token is not provided, the function returns false.
   * @param refreshToken - The refresh token to be used for logging out.
   * @returns An observable that resolves to true if the logout was successful, false otherwise.
   */
  logout(refreshToken: string): Observable<boolean> {
    if (!refreshToken) return of(false);
    const body = { refreshToken: refreshToken };
    const url = 'Auth/logout';
    return this.apiHttp.post<boolean>(url, body);
  }

  forgotPassword(email: string): Observable<any> {
    if (!email) return of(null);
    const url = 'Auth/forgot-password';
    const body = { email: email };
    return this.apiHttp.post<string>(url, body).pipe(
      map((res) => {
        if (res) return 'Done';
        return null;
      })
    );
  }

  resetPassword(dto: ResetPasswordDto): Observable<any> {
    if (!dto) return of(null);
    const url = 'Auth/reset-password';
    return this.apiHttp.post<string>(url, dto).pipe(
      map((res) => {
        if (res) return true;
        return null;
      })
    );
  }

  register(dto: RegisterDto): Observable<boolean> {
    if (!dto) return of(false);
    const url = 'Auth/register';
    const body = {
      email: dto.email,
      username: dto.username,
      password: dto.password,
      displayName: dto.displayName,
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => !!res),
      catchError((error: any) => {
        console.error('Registration error in the API service:', error);
        return of(false);
      })
    );
  }

  accountActivation(dto: AccountActivationDto) {
    if (!dto) return of(false);
    const url = 'Auth/activate-account';
    const body = {
      userEmail: dto.userEmail,
      activationToken: dto.activationToken,
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => !!res),
      catchError((error: any) => {
        console.error('Account activation error in the API service:', error);
        return of(false);
      })
    );
  }

  checkEmail(email: string): Observable<boolean> {
    if (!email) return of(false);
    const url = 'Auth/check-email';
    return this.apiHttp
      .get<boolean>(url, {
        params: { email },
      })
      .pipe(
        map((res) => !!res),
        catchError((error: any) => {
          console.error('Email check error in the API service:', error);
          return of(false);
        })
      );
  }

  checkUsername(username: string): Observable<boolean> {
    if (!username) return of(false);
    const url = 'Auth/check-username';
    return this.apiHttp
      .get<boolean>(url, { params: { username: username } })
      .pipe(
        map((res) => !!res),
        catchError((error: any) => {
          console.error('Username check error in the API service:', error);
          return of(false);
        })
      );
  }

  /******************************/
  /* Browser Identifier methods */
  /******************************/

  /**
   * Verifies the OTP answer provided by the user.
   * @param answer - An OtpAnswerDto containing the OTP question ID and answer.
   * @returns An observable that resolves to an authTokenModel containing the access and refresh tokens if the OTP is valid, null otherwise.
   */
  verifyOtp(answer: OtpAnswerDto): Observable<AuthTokenModel | null> {
    const body = {
      otpQuestionId: answer.otpQuestionId,
      otpAnswer: answer.otpAnswer,
    };
    const url = 'DevicesAuth/VerifyOTP';
    return this.apiHttp.post<AuthTokenModel>(url, body).pipe(
      map((res) =>
        res != null
          ? ({
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
              expiresAtUtc: res.expiresAtUtc,
            } as AuthTokenModel)
          : null
      )
    );
  }

  /**
   * Updates the browser identifier stored in the database.
   * @param newBrowserId The new browser identifier to be stored.
   * @returns An observable that resolves to true if the browser identifier was updated successfully, false otherwise.
   */
  updateBrowserId(newBrowserId: string): Observable<boolean | null> {
    if (!newBrowserId) return of(false);
    const body = {
      newId: newBrowserId,
    };
    const url = 'DevicesAuth/UpdateBrowserId';
    return this.apiHttp
      .post<boolean>(url, body)
      .pipe(map((res) => res ?? false));
  }
}

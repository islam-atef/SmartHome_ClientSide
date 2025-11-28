import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { LoginRequestDto } from '../models/login-request.dto';
import { AuthResponseDto } from '../models/auth-response.dto';
import { map, Observable, of } from 'rxjs';
import { authTokenModel } from '../../../core/auth/auth-token-model';
import { environment } from '../../../../environments/environment.development';
import { OtpAnswerDto } from '../models/otp-answer.dto';

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
  beginLogin(data: LoginRequestDto): Observable<AuthResponseDto | null> {
    if (!data || !data.email || !data.password) return of(null);
    const url = '/auth/login';
    // send login request with email and password
    return this.apiHttp
      .post<AuthResponseDto>(url, {
        email: data.email,
        password: data.password,
      })
      .pipe(map((res) => res ?? null));
  }

  /**
   * Refreshes the access and refresh tokens using the provided refresh token.
   * @param refreshToken The refresh token to be used for refreshing.
   * @returns An observable that resolves to the refreshed access and refresh tokens or null if the refresh token is invalid.
   */
  refresh(refreshToken: string): Observable<authTokenModel | null> {
    if (!refreshToken) return of(null);
    const body = { refreshToken: refreshToken };
    const url = 'auth/refresh-token';
    return this.apiHttp.post<authTokenModel>(url, body).pipe(
      map((res) =>
        res != null
          ? ({
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
              expiresAtUtc: res.expiresAtUtc,
            } as authTokenModel)
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
    const url = 'logout';
    return this.apiHttp.post<boolean>(url, body);
  }

  /******************************/
  /* Browser Identifier methods */
  /******************************/

  /**
   * Verifies the OTP answer provided by the user.
   * @param answer - An OtpAnswerDto containing the OTP question ID and answer.
   * @returns An observable that resolves to an authTokenModel containing the access and refresh tokens if the OTP is valid, null otherwise.
   */
  verifyOtp(answer: OtpAnswerDto): Observable<authTokenModel | null> {
    const body = {
      otpQuestionId: answer.otpQuestionId,
      otpAnswer: answer.otpAnswer,
    };
    const url = 'DevicesAuth/VerifyOtp';
    return this.apiHttp.post<authTokenModel>(url, body).pipe(
      map((res) =>
        res != null
          ? ({
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
              expiresAtUtc: res.expiresAtUtc,
            } as authTokenModel)
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

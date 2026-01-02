import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthTokenModel } from '../auth-token-model';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private tokensSubject = new BehaviorSubject<AuthTokenModel | null>(null);
  tokens$ = this.tokensSubject.asObservable();

  setTokens(tokens: AuthTokenModel | null) {
    this.tokensSubject.next(tokens);
    console.log('AuthStateService: setTokens: Tokens set:', tokens);
    console.log(
      `AuthStateService: setTokens: Observed Tokens: ${this.tokensSubject.getValue()}`
    );
  }

  getTokensSnapshot(): AuthTokenModel | null {
    console.log(
      'AuthStateService: getTokensSnapshot: Tokens snapshot:',
      this.tokensSubject.value
    );
    return this.tokensSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.tokensSubject.value?.accessToken;
  }

  get isRefreshTokenValid(): boolean {
    const tokens = this.tokensSubject.value;
    return !!tokens?.refreshToken && tokens.expiresAtUtc > new Date();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthTokenModel } from '../auth-token-model';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private tokensSubject = new BehaviorSubject<AuthTokenModel | null>(null);
  tokens$ = this.tokensSubject.asObservable();

  setTokens(tokens: AuthTokenModel | null) {
    this.tokensSubject.next(tokens);
  }

  getTokensSnapshot(): AuthTokenModel | null {
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

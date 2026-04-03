import { Injectable } from '@angular/core';
import { AuthTokenModel } from '../auth-token-model';
import { C } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class TokenStoreService {
  private readonly KEY = 'auth_tokens_v1';

  //#region  GET tokens
  getTokens(): AuthTokenModel | null {
    const json = localStorage.getItem(this.KEY);

    if (!json || json.trim() === '') {
      return null;
    }

    try {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== 'object')
        throw new Error('Invalid payload');

      const accessToken =
        typeof parsed.accessToken === 'string' ? parsed.accessToken : null;
      const refreshToken =
        typeof parsed.refreshToken === 'string' ? parsed.refreshToken : null;
      let accessTokenExpiresAtUtc: Date | null = parsed.accessTokenExpiresAtUtc
        ? new Date(parsed.accessTokenExpiresAtUtc)
        : null;
      if (accessTokenExpiresAtUtc && isNaN(accessTokenExpiresAtUtc.getTime())) accessTokenExpiresAtUtc = null;

      if (!accessToken || !refreshToken || !accessTokenExpiresAtUtc) {
        this.clearTokens();
        return null;
      }

      const model = new AuthTokenModel();
      model.accessToken = accessToken;
      model.refreshToken = refreshToken;
      model.accessTokenExpiresAtUtc = accessTokenExpiresAtUtc;
      // display the retrieved token
      console.log('TokenStore: getTokens: token result: ', model);

      return model;
    } catch (err) {
      console.error(
        'TokenStore: getTokens: Invalid token JSON in localStorage. Clearing.',
        err
      );
      this.clearTokens();
      return null;
    }
  }
  //#endregion

  //#region: SAVE tokens
  saveTokens(tokens: AuthTokenModel): void {
    if (!tokens) {
      this.clearTokens();
      return;
    }
    const payload = {
      accessToken: tokens.accessToken ?? null,
      refreshToken: tokens.refreshToken ?? null,
      accessTokenExpiresAtUtc: tokens.accessTokenExpiresAtUtc
        ? tokens.accessTokenExpiresAtUtc instanceof Date
          ? tokens.accessTokenExpiresAtUtc.toISOString()
          : tokens.accessTokenExpiresAtUtc
        : null,
    };
    try {
      const json = JSON.stringify(payload);
      localStorage.setItem(this.KEY, json);
      console.log('TokenStore: saveTokens: token saved: ', tokens);
    } catch (err) {
      console.error('TokenStore: saveTokens: Failed to save tokens', err);
    }
  }
  //#endregion

  //#region: CLEAR tokens
  clearTokens(): void {
    localStorage.removeItem(this.KEY);
    let tokens = this.getTokens();
    console.log('TokenStore: clearTokens: tokens cleared', tokens);
  }
  //#endregion
}

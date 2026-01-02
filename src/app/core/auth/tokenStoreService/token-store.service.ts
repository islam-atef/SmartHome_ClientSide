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
      let expiresAtUtc: Date | null = parsed.expiresAtUtc
        ? new Date(parsed.expiresAtUtc)
        : null;
      if (expiresAtUtc && isNaN(expiresAtUtc.getTime())) expiresAtUtc = null;

      if (!accessToken || !refreshToken || !expiresAtUtc) {
        this.clearTokens();
        return null;
      }

      const model = new AuthTokenModel();
      model.accessToken = accessToken;
      model.refreshToken = refreshToken;
      model.expiresAtUtc = expiresAtUtc;
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
      expiresAtUtc: tokens.expiresAtUtc
        ? tokens.expiresAtUtc instanceof Date
          ? tokens.expiresAtUtc.toISOString()
          : tokens.expiresAtUtc
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

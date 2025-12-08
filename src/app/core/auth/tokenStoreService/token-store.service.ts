import { Injectable } from '@angular/core';
import { AuthTokenModel } from '../auth-token-model';
import { C } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class TokenStoreService {
  private readonly KEY = 'auth_tokens_v1';

  // -----------------------------
  // GET tokens
  // -----------------------------
  getTokens(): AuthTokenModel | null {
    const json = localStorage.getItem(this.KEY);

    if (!json || json.trim() === '') {
      return null;
    }

    try {
      const parsed = JSON.parse(json);
      const model = new AuthTokenModel();
      model.accessToken = parsed.accessToken;
      model.refreshToken = parsed.refreshToken;
      model.expiresAtUtc = new Date(parsed.expiresAtUtc);
      return model;
    } catch (err) {
      console.error(
        '[TokenStore] Invalid token JSON in localStorage. Clearing.',
        err
      );
      this.clearTokens();
      return null;
    }
  }

  // -----------------------------
  // SAVE tokens
  // -----------------------------
  saveTokens(tokens: AuthTokenModel): void {
    try {
      const json = JSON.stringify(tokens);
      localStorage.setItem(this.KEY, json);
    } catch (err) {
      console.error('[TokenStore] Failed to save tokens', err);
    }
  }

  // -----------------------------
  // CLEAR tokens
  // -----------------------------
  clearTokens(): void {
    localStorage.removeItem(this.KEY);
  }
}

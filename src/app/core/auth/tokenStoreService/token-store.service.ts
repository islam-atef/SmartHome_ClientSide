import { Injectable } from '@angular/core';
import { authTokenModel } from '../auth-token-model';

@Injectable({
  providedIn: 'root',
})
export class TokenStoreService {
  private readonly KEY = 'auth_tokens_v1';

  // -----------------------------
  // GET tokens
  // -----------------------------
  getTokens(): authTokenModel | null {
    const json = localStorage.getItem(this.KEY);

    if (!json || json.trim() === '') {
      return null;
    }

    try {
      return JSON.parse(json) as authTokenModel;
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
  saveTokens(tokens: authTokenModel): void {
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

import { Injectable } from '@angular/core';
import { BrowserIdentifierModel } from '../browser-Identifier-Model';

@Injectable({
  providedIn: 'root',
})
export class BrowserIdStoreService {
  private readonly KEY = 'device_id_v1';

  // -----------------------------
  // GET device id
  // -----------------------------
  getBrowserId(): BrowserIdentifierModel | null {
    const json = localStorage.getItem(this.KEY);

    if (!json || json.trim() === '') {
      return null;
    }

    try {
      return JSON.parse(json) as BrowserIdentifierModel;
    } catch (err) {
      console.error(
        '[BrowserIdStore] Invalid token JSON in localStorage. Clearing.',
        err
      );
      this.clearBrowserId();
      return null;
    }
  }

  // -----------------------------
  // SAVE device id
  // -----------------------------
  saveBrowserId(deviceId: BrowserIdentifierModel): void {
    try {
      const json = JSON.stringify(deviceId);
      localStorage.setItem(this.KEY, json);
    } catch (err) {
      console.error('[BrowserIdStore] Failed to save tokens', err);
    }
  }

  // -----------------------------
  // CLEAR device id
  // -----------------------------
  clearBrowserId(): void {
    localStorage.removeItem(this.KEY);
  }
}

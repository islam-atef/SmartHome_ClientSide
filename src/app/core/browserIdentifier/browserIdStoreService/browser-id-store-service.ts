import { Injectable } from '@angular/core';
import { BrowserIdentifierModel } from '../browser-Identifier-Model';

@Injectable({
  providedIn: 'root',
})
export class BrowserIdStoreService {
  private readonly KEY = 'browser_id_v1';

  // -----------------------------
  // GET device id
  // -----------------------------
  getBrowserId(): BrowserIdentifierModel | null {
    const json = localStorage.getItem(this.KEY);
    if (!json || json.trim() === '') {
      // create new device id
      let newBrowserIdentifier = new BrowserIdentifierModel();
      this.saveBrowserId(newBrowserIdentifier);
      return newBrowserIdentifier;
    }
    try {
      const parsed = JSON.parse(json);

      const model = new BrowserIdentifierModel();
      model.browserId = parsed.browserId;
      model.isActive = parsed.isActive;
      model.isUpdated = parsed.isUpdated;
      model.createdAt = new Date(parsed.createdAt);
      model.updatedAt = parsed.updatedAt ? new Date(parsed.updatedAt) : null;
      model.deletedAt = parsed.deletedAt ? new Date(parsed.deletedAt) : null;

      return model;
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
  saveBrowserId(browserIdId: BrowserIdentifierModel): void {
    try {
      const json = JSON.stringify(browserIdId);
      // clear previous data
      localStorage.removeItem(this.KEY);
      // save new data
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

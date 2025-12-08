import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BrowserIdentifierModel } from '../browser-Identifier-Model';

@Injectable({
  providedIn: 'root',
})
export class BrowserIdStateService {
  private idSubject = new BehaviorSubject<BrowserIdentifierModel | null>(null);
  browserId$ = this.idSubject.asObservable();

  setIdentifier(Identifier: BrowserIdentifierModel | null) {
    this.idSubject.next(Identifier);
  }

  getIdentifierSnapshot(): BrowserIdentifierModel | null {
    return this.idSubject.value;
  }

  get isActive(): boolean {
    return !!this.idSubject.value?.isActive;
  }
}

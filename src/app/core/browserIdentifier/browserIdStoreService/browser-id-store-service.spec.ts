import { TestBed } from '@angular/core/testing';

import { BrowserIdStoreService } from './browser-id-store-service';

describe('BrowserIdStoreService', () => {
  let service: BrowserIdStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserIdStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

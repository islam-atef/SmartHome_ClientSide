import { TestBed } from '@angular/core/testing';

import { BrowserIdStateService } from './browser-id-state.service';

describe('BrowserIdStateService', () => {
  let service: BrowserIdStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserIdStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

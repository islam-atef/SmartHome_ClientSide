import { TestBed } from '@angular/core/testing';

import { ApiHttpServiceTs } from './api-http.service.js';

describe('ApiHttpServiceTs', () => {
  let service: ApiHttpServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiHttpServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

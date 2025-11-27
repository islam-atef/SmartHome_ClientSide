import { TestBed } from '@angular/core/testing';

import { JwtClaimReader } from './jwt-claim-reader';

describe('JwtClaimReader', () => {
  let service: JwtClaimReader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtClaimReader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

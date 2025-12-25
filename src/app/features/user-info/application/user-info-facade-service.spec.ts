import { TestBed } from '@angular/core/testing';

import { UserInfoFacadeService } from './user-info-facade-service';

describe('UserInfoFacadeService', () => {
  let service: UserInfoFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfoFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

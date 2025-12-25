import { TestBed } from '@angular/core/testing';

import { UserInfoApiService } from './user-info-api-service';

describe('UserInfoApiService', () => {
  let service: UserInfoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { NotificationsAPIService } from './notifications-api-service';

describe('NotificationsAPIService', () => {
  let service: NotificationsAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

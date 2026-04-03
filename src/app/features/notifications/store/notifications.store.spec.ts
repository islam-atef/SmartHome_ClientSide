import { TestBed } from '@angular/core/testing';

import { NotificationsStore } from './notifications.store';

describe('NotificationsStore', () => {
  let service: NotificationsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

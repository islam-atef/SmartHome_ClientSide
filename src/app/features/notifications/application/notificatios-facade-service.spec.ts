import { TestBed } from '@angular/core/testing';

import { NotificatiosFacadeService } from './notificatios-facade-service';

describe('NotificatiosFacadeService', () => {
  let service: NotificatiosFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificatiosFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

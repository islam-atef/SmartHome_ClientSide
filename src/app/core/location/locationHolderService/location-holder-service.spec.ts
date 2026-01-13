import { TestBed } from '@angular/core/testing';

import { LocationHolderService } from './location-holder-service';

describe('LocationHolderService', () => {
  let service: LocationHolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationHolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocationModel } from '../location-model';

@Injectable({
  providedIn: 'root',
})
export class LocationHolderService {
  private locationSubject = new BehaviorSubject<LocationModel | null>(null);
  location$ = this.locationSubject.asObservable();

  setLocation(location: LocationModel | null) {
    this.locationSubject.next(location);
    console.log('LocationHolderService: setLocation: Location set:', location);
    console.log(
      `LocationHolderService: setLocation: Observed Location: ${this.locationSubject.getValue()}`
    );
  }

  getLocationSnapshot(): LocationModel | null {
    console.log(
      'LocationHolderService: getLocationSnapshot: location snapshot:',
      this.locationSubject.value
    );
    return this.locationSubject.value;
  }

  get settingDate(): Date | null {
    return this.locationSubject.value?.settingDate ?? null;
  }
}

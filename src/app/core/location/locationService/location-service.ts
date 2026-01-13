import { Injectable } from '@angular/core';
import { LocationModel } from '../location-model';
import { ApiHttpService } from '../../http/api-http.service';
import { catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: ApiHttpService) {}

  getCurrentLocation(): Promise<LocationModel> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            settingDate: new Date(),
          }),
        (err) => reject(err),
        { enableHighAccuracy: true }
      );
    });
  }

  getAddresses(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        return res;
      }),
      tap((res) =>
        console.log('LocationService: getAddresses: the coming result is:', res)
      ),
      catchError((error) => {
        console.error(
          'LocationService: getAddresses: there is an error:',
          error
        );
        return error;
      })
    );
  }
}

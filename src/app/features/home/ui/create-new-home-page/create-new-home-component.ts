import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HomeFacadeService } from '../../application/home-facade-service';
import { MapLocationPickerComponent } from './inner-components/map-location-picker-component/map-location-picker-component';
import { LocationModel } from '../../../../core/location/location-model';
import { LocationService } from '../../../../core/location/locationService/location-service';
import { LocationHolderService } from '../../../../core/location/locationHolderService/location-holder-service';
import { FormsModule } from '@angular/forms';
import { AddressModel } from '../../../../core/location/address-model';
import { AddHomeDto } from '../../models/request-dtos/add-home-dto';
import { delay } from 'rxjs';

@Component({
  selector: 'app-create-new-home-component',
  imports: [MapLocationPickerComponent, FormsModule, RouterLink],
  templateUrl: './create-new-home-component.html',
  styleUrl: './create-new-home-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewHomeComponent implements OnInit {
  @ViewChild(MapLocationPickerComponent) mapPicker?: MapLocationPickerComponent;
  initialCenter: LocationModel | null = null;
  homeLocation!: LocationModel;
  homeAddress!: AddressModel;
  isModalOpen = false;
  homeName!: string;
  mapReady = false;

  constructor(
    private router: Router,
    private homeFacade: HomeFacadeService,
    private cdr: ChangeDetectorRef,
    private location: LocationService,
    private locationHolder: LocationHolderService
  ) {}

  async ngOnInit(): Promise<void> {
    // get current location
    this.initialCenter = await this.location.getCurrentLocation();
    if (this.initialCenter) {
      this.mapReady = true;
      this.cdr.detectChanges();
    }
    console.log(
      'CreateNewHomeComponent: ngOnInit: Initial Center:',
      this.initialCenter
    );

    // get stored location
    let storedLocation = this.locationHolder.getLocationSnapshot();
    console.log(
      'CreateNewHomeComponent: ngOnInit: Stored Location:',
      storedLocation
    );

    // update location
    this.updateLocation(storedLocation, this.initialCenter);
  }

  //#region Map Modal
  openModal() {
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  closeModal() {
    this.isModalOpen = false;
    console.log(
      'CreateNewHomeComponent: closeModal method: closeModal has been called'
    );
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }
  //#endregion

  locationSelected($event: LocationModel) {
    if ($event) {
      this.homeLocation = $event;
      console.log(
        'CreateNewHomeComponent: locationSelected: Home Location:',
        this.homeLocation
      );
      this.resolveAddress(this.homeLocation.lat, this.homeLocation.lng);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 1000);
      return;
    }
    console.log(
      'CreateNewHomeComponent: locationSelected: No location selected'
    );
    return;
  }

  ChooseMyCurrentLocation() {
    if (this.initialCenter) {
      this.homeLocation = this.initialCenter;
      this.resolveAddress(this.homeLocation.lat, this.homeLocation.lng);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 1000);
      return;
    }
    console.log(
      'CreateNewHomeComponent: ChooseMyCurrentLocation: No current location found'
    );
    return;
  }

  createHome() {
    console.log(
      'CreateNewHomeComponent: createHome: createHome has been called'
    );
    setTimeout(() => {
      if (this.homeLocation && this.homeName) {
        if (!this.homeAddress || !this.homeLocation) {
          console.log(
            'CreateNewHomeComponent: createHome: No address or location found'
          );
          return;
        }
        console.log(
          'CreateNewHomeComponent: createHome: Home creation started'
        );
        const home: AddHomeDto = {
          latitude: this.homeLocation.lat,
          longitude: this.homeLocation.lng,
          homeName: this.homeName,
          ISO3166_2_lvl4: this.homeAddress.ISO3166_2_lvl4,
          country: this.homeAddress.country,
          state: this.homeAddress.state,
          road: this.homeAddress.road,
          house_number: this.homeAddress.house_number,
        };
        const res = this.homeFacade.createNewHome(home);
        console.log(
          'CreateNewHomeComponent: createHome: creation returned value:',
          res
        );
        this.router.navigate(['/home', res]);
      }
    }, 1000); // 1000 milliseconds = 1 second
  }

  //#region private methods
  private checkLocationEquality(
    location1: LocationModel,
    location2: LocationModel
  ) {
    return location1.lat === location2.lat && location1.lng === location2.lng;
  }

  private updateLocation(
    storedLocation: LocationModel | null,
    newLocation: LocationModel
  ) {
    if (
      storedLocation &&
      !this.checkLocationEquality(newLocation, storedLocation)
    ) {
      this.locationHolder.setLocation(newLocation);
    } else {
      this.locationHolder.setLocation(newLocation);
    }
  }

  private resolveAddress(lat: number, lng: number) {
    this.location.getAddresses(lat, lng).subscribe((res) => {
      this.homeAddress = res.address;
      console.log(
        'CreateNewHomeComponent: resolveAddress: Address:',
        this.homeAddress
      );
    });
  }
  //#endregion
}

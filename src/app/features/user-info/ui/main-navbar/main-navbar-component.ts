import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { UserInfoFacadeService } from '../../application/user-info-facade-service';
import { AuthFacadeService } from '../../../auth/application/auth-facade.service';
import { RouterLink } from '@angular/router';
import { NotificationBellComponent } from '../../../notifications/ui/notification-bell/notification-bell.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-main-navbar-component',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIcon,
    RouterLink,
    MatSlideToggleModule,
    NotificationBellComponent
  ],
  templateUrl: './main-navbar-component.html',
  styleUrls: ['./main-navbar-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarComponent {
  constructor(
    private cdr: ChangeDetectorRef,
    private userInfoFacade: UserInfoFacadeService,
    private authFacade: AuthFacadeService
  ) { }

  @Input() imageSource: string = '';
  @Input() userName: string = '';
  @Output() searchHomes: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchLocally: EventEmitter<boolean> = new EventEmitter<boolean>();

  //#region: search option
  searchLocallySliderNextValue = signal<boolean>(true);
  //#endregion

  //#region: logout method
  logout() {
    this.userInfoFacade.userData$.subscribe((data) => {
      let email = data?.email;
      if (!email) {
        console.error(
          'MainNavbarComponent: logout: Unable to logout, email is missing'
        );
        return;
      }
      this.authFacade.logout(email);
      console.log('MainNavbarComponent: logout: Logout clicked');
    });
  }
  //#endregion

  //#region: search method
  search(searchTerm: string) {
    console.log(searchTerm);
    this.searchHomes.emit(searchTerm);
  }

  searchOption(searchLocallyOption: boolean) {
    this.searchLocallySliderNextValue.set(!searchLocallyOption);
    console.log('MainNavbarComponent: searchOption: received Search Option:', searchLocallyOption);
    console.log('MainNavbarComponent: searchOption: Search Locally Option:', this.searchLocallySliderNextValue());
    this.searchLocally.emit(this.searchLocallySliderNextValue());
  }
  //#endregion
}

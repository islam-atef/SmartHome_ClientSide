import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UserInfoFacadeService } from '../../application/user-info-facade-service';
import { UserGeneralInfoDTO } from '../../models/user-general-info.dto';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { UserNameComponent } from './inner-components/user-name-component/user-name-component';
import { UserPhoneComponent } from './inner-components/user-phone-component/user-phone-component';
import { UserImageComponent } from './inner-components/user-image-component/user-image-component';
import { RouterLink } from '@angular/router';
import { AuthFacadeService } from '../../../auth/application/auth-facade.service';

@Component({
  selector: 'app-account-setting-page-component',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    UserNameComponent,
    UserPhoneComponent,
    UserImageComponent,
    RouterLink,
  ],
  templateUrl: './account-setting-page-component.html',
  styleUrl: './account-setting-page-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingPageComponent implements OnInit {
  constructor(
    private userInfoFacade: UserInfoFacadeService,
    private authFacade: AuthFacadeService,
    private cdr: ChangeDetectorRef
  ) {}

  userInfo: UserGeneralInfoDTO | null = null;

  ngOnInit(): void {
    this.userInfoFacade.userData$.subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;
        console.log(
          'AccountSettingPageComponent: ngOnInit: userInfo updated:',
          userInfo
        );
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
      },
    });
  }

  onNameUpdated(newName: string): void {
    console.log('Name updated:', newName);
    // TODO: Call API to update user name
    this.userInfoFacade.UpdateDisplayName(newName);
    this.cdr.detectChanges();
  }

  onUserNameUpdated(newUserName: string): void {
    console.log('Username updated:', newUserName);
    // TODO: Call API to update user username
    let result = this.userInfoFacade.UpdateUserName(newUserName);
    if (result === true) this.cdr.detectChanges();
    else {
      console.error('Error updating username');
      if (result !== false) alert('there is another User Using this username');
    }
  }

  onImageUpdate($event: File): void {
    console.log('New image file received in parent:', $event);
    // TODO: Call API to update user Image
    this.userInfoFacade.UpdateUserImage($event);
    this.cdr.detectChanges();
  }

  onPhoneNumberUpdated($event: string): void {
    console.log('New phone number received in parent:', $event);
    // TODO: Call API to update user Phone Number
    this.userInfoFacade.UpdatePhoneNumber($event);
    this.cdr.detectChanges();
  }

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
}

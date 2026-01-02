import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { UserInfoFacadeService } from '../../application/user-info-facade-service';
import { AuthFacadeService } from '../../../auth/application/auth-facade.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-navbar-component',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIcon,
    RouterLink,
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
  ) {}

  @Input() imageSource: string = '';
  @Input() userName: string = '';

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

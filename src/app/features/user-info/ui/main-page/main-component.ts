import { Component } from '@angular/core';
import { MainNavbarComponent } from '../main-navbar/main-navbar-component';
import { UserInfoFacadeService } from '../../application/user-info-facade-service';
import { UserHomeDTO } from '../../models/user-home.dto';
import { HomeCardComponent } from '../home-card-component/home-card-component';

@Component({
  selector: 'app-main-component',
  imports: [MainNavbarComponent, HomeCardComponent],
  templateUrl: './main-component.html',
  styleUrl: './main-component.css',
})
export class MainComponent {
  userName!: string;
  userImage!: string;
  userHomes!: UserHomeDTO[];

  constructor(private userInfoFacade: UserInfoFacadeService) {
    this.userInfoFacade.getUserData();
    this.userInfoFacade.userData$.subscribe((data) => {
      this.userName = data?.name ?? 'Not Found';
      this.userImage = data?.userImageUrl ?? '';

      console.log('MainComponent: constructor: User Name:', this.userName);
      console.log(
        'MainComponent: constructor: User Image URL:',
        this.userImage
      );
    });
    this.userInfoFacade.userHomes$.subscribe((data) => {
      this.userHomes = data ?? [];
      console.log('MainComponent: constructor: User Homes:', this.userHomes);
    });
  }
}

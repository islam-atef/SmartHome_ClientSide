import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MainNavbarComponent } from '../main-navbar/main-navbar-component';
import { UserInfoFacadeService } from '../../application/user-info-facade-service';
import { UserHomeDTO } from '../../models/user-home.dto';
import { HomeCardComponent } from '../../../home/ui/home-card-component/home-card-component';

@Component({
  selector: 'app-main-component',
  imports: [MainNavbarComponent, HomeCardComponent],
  templateUrl: './main-component.html',
  styleUrl: './main-component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  userName!: string;
  userImage!: string;
  userHomes!: UserHomeDTO[];

  constructor(
    private userInfoFacade: UserInfoFacadeService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.getInitialData();
  }

  //#region: main data collection method
  getInitialData() {
    this.userInfoFacade.getUserData();
    this.userInfoFacade.userData$.subscribe((data) => {
      this.userName = data?.name!;
      this.userImage = data?.userImageUrl!;
      if (this.userImage || this.userImage) {
        console.log('MainComponent: constructor: User Name:', this.userName);
        console.log(
          'MainComponent: constructor: User Image URL:',
          this.userImage
        );
        this.cdr.detectChanges();
      }
    });
    this.userInfoFacade.userHomes$.subscribe((data) => {
      this.userHomes = data ?? [];
      if (this.userHomes) {
        this.cdr.detectChanges();
        console.log('MainComponent: constructor: User Homes:', this.userHomes);
      }
    });
  }
  //#endregion
}

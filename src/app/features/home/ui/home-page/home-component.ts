import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { HomeUserComponent } from './inner-components/home-user-component/home-user-component';
import { HomeAdminComponent } from './inner-components/home-admin-component/home-admin-component';
import { HomeRoomComponent } from './inner-components/home-room-component/home-room-component';
import { HomeFacadeService } from '../../application/home-facade-service';
import { HomeDataDTO } from '../../models/response-dtos/home-data.dto';
import { UserInfoFacadeService } from '../../../user-info/application/user-info-facade-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationBellComponent } from '../../../notifications/ui/notification-bell/notification-bell.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-home-component',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    HomeUserComponent,
    HomeRoomComponent,
    HomeAdminComponent,
    RouterModule,
    CommonModule,
    NotificationBellComponent,
    MatTooltipModule
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private homeFacade: HomeFacadeService,
    private userData: UserInfoFacadeService,
    private cd: ChangeDetectorRef) { }

  homeData: HomeDataDTO | null = null;
  isOwner: boolean = false;
  isUserIn: boolean = false;

  userInvitationId: string = '';
  subscriptionId: string = '';

  readonly GUID_EMPTY = '00000000-0000-0000-0000-000000000000';

  @ViewChild(HomeRoomComponent) homeRoomComponent!: HomeRoomComponent;
  @ViewChild(HomeUserComponent) homeUserComponent!: HomeUserComponent;
  @ViewChild(HomeAdminComponent) homeAdminComponent!: HomeAdminComponent;

  ngOnInit(): void {
    const homeId = this.route.snapshot.paramMap.get('homeId');
    if (!homeId) return;

    this.homeFacade.getHomeData(homeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.homeData = res;
        if (res) {
          this.checkOwner();
          this.checkUserIn();
        }
        this.cd.detectChanges();
      },
      error: (err) => console.error('HomeComponent: getHomeData error:', err)
    });
  }

  //#region notification handlers
  handleRoomsNotification(result: boolean) {
    if (result) {
      this.cd.detectChanges();
    }
  }

  handleUsersNotification(result: boolean) {
    if (result) {
      this.cd.detectChanges();
    }
  }

  handleAdminNotification(result: boolean) {
    if (result) {
      this.cd.detectChanges();
    }
  }
  //#endregion

  //#region Check methods
  private checkOwner() {
    this.userData.userData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.isOwner = (res?.email === this.homeData?.ownerEmail);
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error(`HomeComponent: checkOwner: ${error}`);
        this.isOwner = false;
        this.cd.detectChanges();
      }
    });
  }

  private checkUserIn() {
    if (this.isOwner) {
      this.isUserIn = true;
      this.cd.detectChanges();
      return;
    }

    /////////////////////////////////////////////
    this.userData.userData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.isUserIn = !!this.homeData?.homeUsers.some((user) => user.userEmail === res?.email);
      },
      error: (error) => {
        console.error(`HomeComponent: checkUserIn: ${error}`);
        this.isUserIn = false;
      }
    });

    if (!this.isUserIn) {
      // check if user is invited
      this.userData.checkUserInvitation(this.homeData?.homeId!).subscribe({
        next: (res: string) => {
          if (res !== this.GUID_EMPTY) {
            this.userInvitationId = res;
          } else {
            this.userInvitationId = '';
          }
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error(`HomeComponent: checkUserInvitation: ${error}`);
          this.userInvitationId = '';
          this.cd.detectChanges();
        }
      });
      // check if user is subscribed
      if (this.userInvitationId === '') {
        this.userData.checkUserSubscription(this.homeData?.homeId!).subscribe({
          next: (res) => {
            if (res === this.GUID_EMPTY) {
              this.subscriptionId = '';
            } else {
              this.subscriptionId = res;
            }
            this.cd.detectChanges();
          },
          error: (error) => {
            console.error(`HomeComponent: checkUserSubscription: ${error}`);
            this.subscriptionId = '';
            this.cd.detectChanges();
          }
        });
      }
    }
    this.cd.detectChanges();
  }
  //#endregion

  //#region Invitation handlers
  acceptInvitation() {
    console.log("HomeComponent: acceptInvitation: userInvitationId: ", this.userInvitationId);
    if (this.userInvitationId === this.GUID_EMPTY) {
      alert("No invitation Id found");
      return;
    }
    this.userData.AcceptUserInvitation(this.userInvitationId).subscribe({
      next: (result) => {
        if (result) {
          alert("Invitation accepted successfully");
          this.isUserIn = true;
          this.cd.detectChanges();
        } else {
          alert("Failed to accept invitation");
        }
      },
      error: (err) => alert("Failed to accept invitation: " + err.message)
    });
  }

  rejectInvitation() {
    console.log("HomeComponent: rejectInvitation: userInvitationId: ", this.userInvitationId);
    if (this.userInvitationId === this.GUID_EMPTY) {
      alert("No invitation Id found");
      return;
    }
    this.userData.RejectUserInvitation(this.userInvitationId).subscribe({
      next: (result) => {
        if (result) {
          alert("Invitation rejected successfully");
          this.userInvitationId = '';
          this.cd.detectChanges();
        } else {
          alert("Failed to reject invitation");
        }
      },
      error: (err) => alert("Failed to reject invitation: " + err.message)
    });
  }
  //#endregion

  //#region Subscription handlers
  subscribeToHome() {
    const homeId = this.homeData?.homeId;
    if (!homeId) return;

    this.userData.SubscribeToHome(homeId).subscribe({
      next: (result) => {
        if (result) {
          alert("Subscribed to home successfully, and the subscription ID is: " + result);
          // we need to change the DOM to show the user is subscribed
          this.subscriptionId = result;
          this.cd.detectChanges();
        } else {
          alert("Failed to subscribe to home");
        }
      },
      error: (err) => alert("Failed to subscribe: " + err.message)
    });
  }

  unsubscribeFromHome() {
    this.userData.DeleteSubscriptionRequest(this.subscriptionId).subscribe({
      next: (result) => {
        if (result) {
          alert("Unsubscribed from home successfully");
        } else {
          alert("Failed to unsubscribe from home");
        }
      },
      error: (err) => alert("Failed to unsubscribe: " + err.message)
    });
  }
  //#endregion

  //#region Refresh data
  refreshData() {
    this.ngOnInit();
    this.homeRoomComponent.ngOnInit();
    this.homeUserComponent.ngOnInit();
    this.homeAdminComponent.ngOnChanges();
  }
  //#endregion
}

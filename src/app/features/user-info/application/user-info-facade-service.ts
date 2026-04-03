import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { UserGeneralInfoDTO } from '../models/user-general-info.dto';
import { UserInfoApiService } from '../data-access/user-info-api-service';
import { UserHomeDTO } from '../models/user-home.dto';
import { UserHomeSubscriptionDTO } from '../models/user-home-subRequest.dto';

@Injectable({
  providedIn: 'root',
})
export class UserInfoFacadeService {
  constructor(private userInfoApi: UserInfoApiService) { }

  //#region: User General Info
  private _userData = new BehaviorSubject<UserGeneralInfoDTO | null>(null);
  userData$ = this._userData.asObservable();
  setUserData(data: UserGeneralInfoDTO | null) {
    this._userData.next(data);
    console.log('UserInfoFacadeService: setUserData: User Data set:', data);
    console.log(
      `UserInfoFacadeService: setUserData: Observed User Data: ${this._userData.getValue()}`
    );
  }

  private _userHomes = new BehaviorSubject<UserHomeDTO[] | null>(null);
  userHomes$ = this._userHomes.asObservable();
  setUserHomes(data: UserHomeDTO[] | null) {
    this._userHomes.next(data);
    console.log('UserInfoFacadeService: setUserHomes: User Homes set:', data);
    console.log(
      `UserInfoFacadeService: setUserHomes: Observed User Homes: ${this._userHomes.getValue()}`
    );
  }

  getUserData() {
    this.userInfoApi.getUserInfo().subscribe({
      next: (res: UserGeneralInfoDTO | null) => {
        console.log(
          `UserInfoFacadeService: getUserData: user info result: ${res}`
        );
        this.setUserData(res);
      },
      error: (error) =>
        console.error(`UserInfoFacadeService: getUserData: ${error}`),
    });

    this.userInfoApi.getUserHomes().subscribe({
      next: (res: UserHomeDTO[] | null) => {
        console.log(
          `UserInfoFacadeService: getUserData: user Homes result: ${res}`
        );
        this.setUserHomes(res);
      },
      error: (error) =>
        console.error(`UserInfoFacadeService: getUserData: ${error}`),
    });
  }
  //#endregion

  //#region: User Home Get Subscription methods
  private _userSubscriptions = new BehaviorSubject<
    UserHomeSubscriptionDTO[] | null
  >(null);
  userSubscriptions$ = this._userSubscriptions.asObservable();
  setUserSubscriptions(data: UserHomeSubscriptionDTO[] | null) {
    this._userSubscriptions.next(data);
    console.log(
      'UserInfoFacadeService: setUserSubscriptions: User Subscriptions set:',
      data
    );
    console.log(
      `UserInfoFacadeService: setUserSubscriptions: Observed User Subscriptions: ${this._userSubscriptions.getValue()}`
    );
  }

  getUserSubscriptions() {
    this.userInfoApi.getUserAllHomeSubRequests().subscribe({
      next: (res: UserHomeSubscriptionDTO[] | null) => {
        this.setUserSubscriptions(res);
      },
      error: (error) =>
        console.error(`UserInfoFacadeService: getUserSubscriptions: ${error}`),
    });
  }
  //#endregion

  //#region: User Home Subscribe methods
  SubscribeToHome(homeId: string): Observable<string> {
    return this.userInfoApi.SubscribeToHome(homeId).pipe(
      tap((res: string) => {
        console.log(`UserInfoFacadeService: SubscribeToHome: result: ${res}`);
        this.getUserSubscriptions();
      })
    );
  }

  DeleteSubscriptionRequest(requestId: string): Observable<boolean> {
    return this.userInfoApi.DeleteSubscriptionRequest(requestId).pipe(
      tap((res: boolean) => {
        console.log(
          `UserInfoFacadeService: DeleteSubscriptionRequest: DeleteSubscriptionRequest result: ${res}`
        );
        if (res) {
          let subs = this._userSubscriptions.getValue() ?? null;
          subs = subs?.filter((sub) => sub.requestId !== requestId) ?? null;
          this.setUserSubscriptions(subs);
        }
      })
    );
  }
  //#endregion

  //#region: User Home Invitation methods
  AcceptUserInvitation(invitationId: string): Observable<boolean> {
    return this.userInfoApi.AcceptHomeInvitation(invitationId).pipe(
      tap((res: boolean) => {
        console.log(`UserInfoFacadeService: AcceptUserInvitation: result: ${res}`);
        this.getUserSubscriptions();
      })
    );
  }

  RejectUserInvitation(invitationId: string): Observable<boolean> {
    return this.userInfoApi.RejectHomeInvitation(invitationId).pipe(
      tap((res: boolean) => {
        console.log(`UserInfoFacadeService: RejectUserInvitation: result: ${res}`);
        this.getUserSubscriptions();
      })
    );
  }
  //#endregion  

  //#region: User Data Modification
  UpdatePhoneNumber(phoneNumber: string) {
    this.userInfoApi.UpdatePhoneNumber(phoneNumber).subscribe({
      next: (res) => {
        console.log(`UserInfoFacadeService: UpdatePhoneNumber: result: ${res}`);
        if (res) {
          let data = this._userData.getValue();
          if (data) {
            data.phoneNumber = phoneNumber;
            this.setUserData(data);
          }
        }
      },
      error: (error) =>
        console.error(`UserInfoFacadeService: UpdatePhoneNumber: ${error}`),
    });
  }

  UpdateDisplayName(displayName: string) {
    this.userInfoApi.UpdateDisplayName(displayName).subscribe({
      next: (res) => {
        console.log(
          ` UserInfoFacadeService: UpdateDisplayName: result: ${res}`
        );
        if (res) {
          let data = this._userData.getValue();
          if (data) {
            data.name = displayName;
            this.setUserData(data);
          }
        }
      },
      error: (error) =>
        console.error(` UserInfoFacadeService: UpdateDisplayName: ${error}`),
    });
  }

  UpdateUserName(userName: string): boolean | string {
    this.userInfoApi.UpdateUserName(userName).subscribe({
      next: (res: boolean) => {
        console.log(` UserInfoFacadeService: UpdateUserName: result: ${res}`);
        if (res) {
          let data = this._userData.getValue();
          if (data) {
            data.userName = userName;
            this.setUserData(data);
          }
          return true;
        }
        return false;
      },
      error: (error) => {
        console.error(` UserInfoFacadeService: UpdateUserName: ${error}`);
        return error?.message || 'An unexpected error occurred';
      },
    });
    return false;
  }

  UpdateUserImage(image: File) {
    this.userInfoApi.UpdateUserImage(image).subscribe({
      next: (res) => {
        console.log(`UserInfoFacadeService: UpdateUserImage: result: ${res}`);
        if (res) {
          let data = this._userData.getValue();
          if (data) {
            data.userImageUrl = res;
            this.setUserData(data);
          }
        }
      },
      error: (error) =>
        console.error(`UserInfoFacadeService: UpdateUserImage: ${error}`),
    });
  }
  //#endregion

  //#region Check User Methods
  checkUserSubscription(homeId: string): Observable<string> {
    return this.userInfoApi.checkUserSubscription(homeId);
  }

  checkUserInvitation(homeId: string): Observable<string> {
    return this.userInfoApi.checkUserInvitation(homeId);
  }
  //#endregion
}

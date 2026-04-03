import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UserGeneralInfoDTO } from '../models/user-general-info.dto';
import { UserHomeDTO } from '../models/user-home.dto';
import { UserHomeSubscriptionDTO } from '../models/user-home-subRequest.dto';
import { HomeInvitationDTO } from '../../home/models/response-dtos/home-invitation.dto';

@Injectable({
  providedIn: 'root',
})
export class UserInfoApiService {
  constructor(private apiHttp: ApiHttpService) { }

  //#region: User Info
  getUserInfo(): Observable<UserGeneralInfoDTO | null> {
    const url = 'UserInfo/Get-Info';
    return this.apiHttp.get<UserGeneralInfoDTO>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserHomes(): Observable<UserHomeDTO[] | null> {
    const url = 'UserInfo/Get-Homes';
    return this.apiHttp.get<UserHomeDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

  //#region: User Home Subscriptions
  getUserAllHomeSubRequests(): Observable<
    UserHomeSubscriptionDTO[] | null
  > {
    const url = 'UserInfo/Get-All-HSRQ';
    return this.apiHttp.get<UserHomeSubscriptionDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserHomeSubRequestById(requestId: string): Observable<
    UserHomeSubscriptionDTO | null
  > {
    const url = 'UserInfo/Get-HSRQ-ById';
    return this.apiHttp.get<UserHomeSubscriptionDTO>(url, { params: { requestId } }).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserPendingHomeSubRequests(): Observable<
    UserHomeSubscriptionDTO[] | null
  > {
    const url = 'UserInfo/Get-Pending-HSRQ';
    return this.apiHttp.get<UserHomeSubscriptionDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserAcceptedHomeSubRequests(): Observable<
    UserHomeSubscriptionDTO[] | null
  > {
    const url = 'UserInfo/Get-Accepted-HSRQ';
    return this.apiHttp.get<UserHomeSubscriptionDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserRejectedHomeSubRequests(): Observable<
    UserHomeSubscriptionDTO[] | null
  > {
    const url = 'UserInfo/Get-Rejected-HSRQ';
    return this.apiHttp.get<UserHomeSubscriptionDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  SubscribeToHome(homeId: string): Observable<string> {
    const url = 'UserInfo/Subscribe-ToHome';
    const body = { homeId: homeId };
    return this.apiHttp.post<string>(url, body).pipe(
      map((res) => res ?? ''),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  DeleteSubscriptionRequest(requestId: string): Observable<boolean> {
    const url = 'UserInfo/Delete-SubRequest';
    return this.apiHttp.delete<boolean>(url, { params: { requestId } }).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

  //#region: User Home Invitations
  getUserAllHomeInvitations(): Observable<
    HomeInvitationDTO[] | null
  > {
    const url = 'UserInfo/Get-All-HomeInvitations';
    return this.apiHttp.get<HomeInvitationDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserHomeInvitationById(requestId: string): Observable<
    HomeInvitationDTO | null
  > {
    const url = 'UserInfo/Get-HomeInvitation-ById';
    return this.apiHttp.get<HomeInvitationDTO>(url, { params: { requestId } }).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserPendingHomeInvitations(): Observable<
    HomeInvitationDTO[] | null
  > {
    const url = 'UserInfo/Get-Pending-HomeInvitations';
    return this.apiHttp.get<HomeInvitationDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserAcceptedHomeInvitations(): Observable<
    HomeInvitationDTO[] | null
  > {
    const url = 'UserInfo/Get-Accepted-HomeInvitations';
    return this.apiHttp.get<HomeInvitationDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserRejectedHomeInvitations(): Observable<
    HomeInvitationDTO[] | null
  > {
    const url = 'UserInfo/Get-Rejected-HomeInvitations';
    return this.apiHttp.get<HomeInvitationDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  AcceptHomeInvitation(invitationId: string): Observable<boolean> {
    const url = 'UserInfo/Accept-Home-Invitation';
    const body = { invitationId: invitationId };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  RejectHomeInvitation(invitationId: string): Observable<boolean> {
    const url = 'UserInfo/Reject-Home-Invitation';
    const body = { invitationId: invitationId };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

  //#region: User Data Modification
  UpdatePhoneNumber(phoneNumber: string): Observable<boolean> {
    const url = 'UserInfo/Update-PhoneNumber';
    const body = { phoneNumber: phoneNumber };
    return this.apiHttp.patch<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  UpdateDisplayName(displayName: string): Observable<boolean> {
    const url = 'UserInfo/Update-DisplayName';
    const body = { displayName: displayName };
    return this.apiHttp.patch<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  UpdateUserName(userName: string): Observable<boolean> {
    const url = 'UserInfo/Update-UserName';
    const body = { userName: userName };
    return this.apiHttp.patch<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  UpdateUserImage(image: File): Observable<string | null> {
    const url = 'UserInfo/Update-UserImage';
    const formData = new FormData();
    formData.append('Image', image);
    return this.apiHttp.patch<string>(url, formData).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

  //#region Check User Methods
  checkUserSubscription(homeId: string): Observable<string> {
    const url = 'UserInfo/Check-User-Subscription';
    return this.apiHttp.get<string>(url, { params: { homeId } }).pipe(
      map((res) => res ?? 'An unexpected error occurred'),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  checkUserInvitation(homeId: string): Observable<string> {
    const url = 'UserInfo/Check-User-Invitation';
    return this.apiHttp.get<string>(url, { params: { homeId } }).pipe(
      map((res) => res ?? 'An unexpected error occurred'),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion
}

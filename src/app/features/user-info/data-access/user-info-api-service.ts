import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UserGeneralInfoDTO } from '../models/user-general-info.dto';
import { UserHomeDTO } from '../models/user-home.dto';
import { UserHomeSubscriptionRequestDTO } from '../models/user-home-subRequest.dto';

@Injectable({
  providedIn: 'root',
})
export class UserInfoApiService {
  constructor(private apiHttp: ApiHttpService) {}

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

  getUserAllHomeSubRequests(): Observable<
    UserHomeSubscriptionRequestDTO[] | null
  > {
    const url = 'UserInfo/Get-All-HSRQ';
    return this.apiHttp.get<UserHomeSubscriptionRequestDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  getUserNewHomeSubRequests(): Observable<
    UserHomeSubscriptionRequestDTO[] | null
  > {
    const url = 'UserInfo/Get-New-HSRQ';
    return this.apiHttp.get<UserHomeSubscriptionRequestDTO[]>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

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

  SubscribeToHome(homeId: string): Observable<boolean> {
    const url = 'UserInfo/Subscribe-ToHome';
    const body = { homeId: homeId };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
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
}

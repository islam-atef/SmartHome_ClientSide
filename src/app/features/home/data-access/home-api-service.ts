import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HomeDataDTO } from '../models/response-dtos/home-data.dto';
import { HomeSubscriptionDTO } from '../models/response-dtos/home-subscription.dto';
import { RenameHomeDto } from '../models/request-dtos/rename-home.dto';
import { AddRoomDTO } from '../models/request-dtos/add-room.dto';
import { UserDTO as UserDTO } from '../models/request-dtos/user.dto';
import { DeleteRoomDTO } from '../models/request-dtos/delete-room.dto';
import { AddHomeDto } from '../models/request-dtos/add-home-dto';
import { HomeSubscriptionRequestDTO } from '../models/request-dtos/home-subscription.dto';
import { HomeInvitationDTO } from '../models/response-dtos/home-invitation.dto';
import { InvitationRequestDto } from '../models/request-dtos/invitation-request.dto';
import { HomeInvitationRequestDTO } from '../models/request-dtos/home-invitation.dto';
import { SearchResultDTO } from '../models/response-dtos/home-card.dto';

@Injectable({
  providedIn: 'root',
})
export class HomeApiService {
  constructor(private apiHttp: ApiHttpService) { }

  //#region Home data methods
  getHomeData(homeId: string): Observable<HomeDataDTO | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-HomeData';
    return this.apiHttp.get<HomeDataDTO>(url, { params: { homeId } }).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  searchForHomes(searchTerm: string = "", page: number = 1, pageSize: number = 10, lon: number | null = null, lat: number | null = null): Observable<SearchResultDTO | null> {
    if (!searchTerm) return of(null);
    if (page < 0) page = 1;
    if (pageSize < 0) pageSize = 10;
    const url = 'HomeManagement/Search-For-Homes';
    return this.apiHttp.get<SearchResultDTO>(url, { params: { searchTerm, page, pageSize, lon, lat } }).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

  //#region Home subscription request methods
  getHomeSubscriptionRequests(
    homeId: string
  ): Observable<HomeSubscriptionDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-SubRequests';
    return this.apiHttp
      .get<HomeSubscriptionDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  getHomeSubscriptionRequestById(
    requestId: string
  ): Observable<HomeSubscriptionDTO | null> {
    if (!requestId) return of(null);
    const url = 'HomeManagement/Get-Home-SubRequest-ById';
    return this.apiHttp
      .get<HomeSubscriptionDTO>(url, { params: { requestId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  getHomePendingSubscriptionRequest(
    homeId: string
  ): Observable<HomeSubscriptionDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-Pending-SubRequests';
    return this.apiHttp
      .get<HomeSubscriptionDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  getHomeRejectedSubscriptionRequest(
    homeId: string
  ): Observable<HomeSubscriptionDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-Rejected-SubRequests';
    return this.apiHttp
      .get<HomeSubscriptionDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  getHomeAcceptedSubscriptionRequest(
    homeId: string
  ): Observable<HomeSubscriptionDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-Accepted-SubRequests';
    return this.apiHttp
      .get<HomeSubscriptionDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  AcceptSubscriptionRequest(request: HomeSubscriptionRequestDTO): Observable<boolean> {
    if (!request) return of(false);
    const url = 'HomeManagement/Accept-Subscription-Request';
    const body = {
      homeId: request.homeId,
      requestId: request.requestId,
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  RejectSubscriptionRequest(request: HomeSubscriptionRequestDTO): Observable<boolean> {
    if (!request) return of(false);
    const url = 'HomeManagement/Reject-Subscription-Request';
    const body = {
      homeId: request.homeId,
      requestId: request.requestId,
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

  //#region Home Invitations methods
  getHomeInvitations(
    homeId: string
  ): Observable<HomeInvitationDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-Invitations';
    return this.apiHttp
      .get<HomeInvitationDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  getHomeInvitationById(
    invitationId: string
  ): Observable<HomeInvitationDTO | null> {
    if (!invitationId) return of(null);
    const url = 'HomeManagement/Get-Home-Invitation-ById';
    return this.apiHttp
      .get<HomeInvitationDTO>(url, { params: { invitationId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  getHomePendingInvitations(
    homeId: string
  ): Observable<HomeInvitationDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-Pending-Invitations';
    return this.apiHttp
      .get<HomeInvitationDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  getHomeRejectedInvitations(
    homeId: string
  ): Observable<HomeInvitationDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-Rejected-Invitations';
    return this.apiHttp
      .get<HomeInvitationDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  getHomeAcceptedInvitations(
    homeId: string
  ): Observable<HomeInvitationDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-Accepted-Invitations';
    return this.apiHttp
      .get<HomeInvitationDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  InviteNewUser(request: InvitationRequestDto): Observable<boolean> {
    if (!request) return of(false);
    const url = 'HomeManagement/Invite-NewUser';
    const body = {
      homeId: request.homeId,
      userEmail: request.userEmail,
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  DeleteHomeInvitation(invitation: HomeInvitationRequestDTO): Observable<boolean> {
    if (!invitation) return of(false);
    const url = 'HomeManagement/Delete-Home-Invitation';
    const body = {
      homeId: invitation.homeId,
      invitationId: invitation.invitationId,
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

  //#region Home management methods
  createNewHome(home: AddHomeDto): Observable<string> {
    if (!home) return of('');
    const url = 'HomeManagement/Create-NewHome';
    const body = {
      name: home.homeName,
      homeInfo: home.homeInfo,
      longitude: home.longitude,
      latitude: home.latitude,
      iSO3166_2_lvl4: home.ISO3166_2_lvl4,
      country: home.country,
      state: home.state,
      address: home.address
    };
    return this.apiHttp.post<string>(url, body).pipe(
      map((res) => res ?? ''),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  RenameHome(newName: RenameHomeDto): Observable<boolean> {
    if (!newName) return of(false);
    const url = 'HomeManagement/Rename-Home';
    const body = {
      newName: newName.newName,
      HomeId: newName.homeId,
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

  //#region Home's Room methods
  AddNewRoom(room: AddRoomDTO): Observable<string> {
    if (!room) return of('');
    const url = 'HomeManagement/Add-NewRoom';
    const body = {
      homeId: room.homeId,
      roomName: room.roomName,
    };
    return this.apiHttp.post<string>(url, body).pipe(
      map((res) => res ?? ''),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  DeleteRoom(room: DeleteRoomDTO): Observable<boolean> {
    if (!room) return of(false);
    const url = 'HomeManagement/Delete-Room';
    const query = {
      homeId: room.homeId,
      roomId: room.roomId,
    };
    return this.apiHttp.delete<boolean>(url, { params: query }).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

  //#region Home's User methods
  DeleteUser(user: UserDTO): Observable<boolean> {
    if (!user) return of(false);
    const url = 'HomeManagement/Delete-User';
    const query = {
      homeId: user.homeId,
      userEmail: user.userEmail,
    };
    return this.apiHttp.delete<boolean>(url, { params: query }).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }
  //#endregion

}

import { Injectable } from '@angular/core';
import { HomeApiService } from '../data-access/home-api-service';
import { HomeDataDTO } from '../models/response-dtos/home-data.dto';
import { HomeSubscriptionDTO } from '../models/response-dtos/home-subscription.dto';
import { AccessLevel, AddRoomDTO } from '../models/request-dtos/add-room.dto';
import { DeleteRoomDTO } from '../models/request-dtos/delete-room.dto';
import { UserDTO } from '../models/request-dtos/user.dto';
import { AddHomeDto } from '../models/request-dtos/add-home-dto';
import { InvitationRequestDto } from '../models/request-dtos/invitation-request.dto';
import { RenameHomeDto } from '../models/request-dtos/rename-home.dto';
import { Observable } from 'rxjs';
import { HomeInvitationDTO } from '../models/response-dtos/home-invitation.dto';
import { HomeSubscriptionRequestDTO } from '../models/request-dtos/home-subscription.dto';
import { HomeInvitationRequestDTO } from '../models/request-dtos/home-invitation.dto';
import { SearchResultDTO } from '../models/response-dtos/home-card.dto';

@Injectable({
  providedIn: 'root',
})
export class HomeFacadeService {
  constructor(private homeApi: HomeApiService) { }

  //#region Home search methods
  searchForHomes(searchTerm: string, page: number, pageSize: number, lon: number | null, lat: number | null): Observable<SearchResultDTO | null> {
    return this.homeApi.searchForHomes(searchTerm, page, pageSize, lon, lat);
  }
  //#endregion

  //#region Home data methods
  getHomeData(homeId: string): Observable<HomeDataDTO | null> {
    return this.homeApi.getHomeData(homeId);
  }
  //#endregion

  //#region Home management methods
  createNewHome(homeData: AddHomeDto): Observable<string> {
    return this.homeApi.createNewHome(homeData);
  }

  renameHome(homeId: string, name: string): Observable<boolean> {
    const home: RenameHomeDto = {
      homeId: homeId,
      newName: name
    };
    return this.homeApi.RenameHome(home);
  }
  //#endregion

  //#region Subscription Get methods
  getHomePendingSubscriptionRequest(homeId: string): Observable<HomeSubscriptionDTO[] | null> {
    return this.homeApi.getHomePendingSubscriptionRequest(homeId);
  }

  getHomeRejectedSubscriptionRequest(homeId: string): Observable<HomeSubscriptionDTO[] | null> {
    return this.homeApi.getHomeRejectedSubscriptionRequest(homeId);
  }

  getHomeAcceptedSubscriptionRequest(homeId: string): Observable<HomeSubscriptionDTO[] | null> {
    return this.homeApi.getHomeAcceptedSubscriptionRequest(homeId);
  }
  //#endregion

  //#region Invitation Get methods
  getHomePendingInvitations(homeId: string): Observable<HomeInvitationDTO[] | null> {
    return this.homeApi.getHomePendingInvitations(homeId);
  }

  getHomeRejectedInvitations(homeId: string): Observable<HomeInvitationDTO[] | null> {
    return this.homeApi.getHomeRejectedInvitations(homeId);
  }

  getHomeAcceptedInvitations(homeId: string): Observable<HomeInvitationDTO[] | null> {
    return this.homeApi.getHomeAcceptedInvitations(homeId);
  }
  //#endregion

  //#region Room methods
  addRoom(roomName: string, homeId: string, accessType: AccessLevel): Observable<string> {
    const room: AddRoomDTO = { homeId: homeId, roomName: roomName, accessType: accessType };
    return this.homeApi.AddNewRoom(room);
  }

  deleteRoom(roomId: string, homeId: string): Observable<boolean> {
    const room: DeleteRoomDTO = { homeId: homeId, roomId: roomId };
    return this.homeApi.DeleteRoom(room);
  }
  //#endregion

  //#region User methods
  inviteUser(request: InvitationRequestDto): Observable<boolean> {
    return this.homeApi.InviteNewUser(request);
  }

  deleteUser(homeId: string, userEmail: string): Observable<boolean> {
    const user: UserDTO = { homeId: homeId, userEmail: userEmail };
    return this.homeApi.DeleteUser(user);
  }
  //#endregion

  //#region Subscription action methods
  acceptSubscription(request: HomeSubscriptionRequestDTO): Observable<boolean> {
    return this.homeApi.AcceptSubscriptionRequest(request);
  }

  rejectSubscription(request: HomeSubscriptionRequestDTO): Observable<boolean> {
    return this.homeApi.RejectSubscriptionRequest(request);
  }
  //#endregion

  //#region Invitation action methods
  deleteInvitation(invitation: HomeInvitationRequestDTO): Observable<boolean> {
    return this.homeApi.DeleteHomeInvitation(invitation);
  }
  //#endregion
}

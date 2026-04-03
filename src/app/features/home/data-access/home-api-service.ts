import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HomeDataDTO } from '../models/response-dtos/home-data.dto';
import { HomeSubscriptionRequestDTO } from '../models/response-dtos/home-subscription-request.dto';
import { RenameHomeDto } from '../models/response-dtos/rename-home.dto';
import { AddRoomDTO } from '../models/response-dtos/add-room.dto';
import { UserDTO as UserDTO } from '../models/response-dtos/user.dto';
import { DeleteRoomDTO } from '../models/response-dtos/delete-room.dto';
import { AddHomeDto } from '../models/request-dtos/add-home-dto';

@Injectable({
  providedIn: 'root',
})
export class HomeApiService {
  constructor(private apiHttp: ApiHttpService) { }

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

  getHomeAllSubscriptionRequest(
    homeId: string
  ): Observable<HomeSubscriptionRequestDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-SubRequest';
    return this.apiHttp
      .get<HomeSubscriptionRequestDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  getHomeNewSubscriptionRequest(
    homeId: string
  ): Observable<HomeSubscriptionRequestDTO[] | null> {
    if (!homeId) return of(null);
    const url = 'HomeManagement/Get-Home-NewSubRequest';
    return this.apiHttp
      .get<HomeSubscriptionRequestDTO[]>(url, { params: { homeId } })
      .pipe(
        map((res) => res ?? null),
        tap((res) => console.log(res)),
        catchError((error) => {
          return of(error?.message || 'An unexpected error occurred');
        })
      );
  }

  createNewHome(home: AddHomeDto): Observable<string> {
    if (!home) return of('');
    const url = 'HomeManagement/Create-NewHome';
    const body = {
      name: home.homeName,
      homeInfo: home.homeInfo,
      longitude: home.longitude,
      latitude: home.latitude,
      ISO3166_2_lvl4: home.ISO3166_2_lvl4,
      country: home.country,
      state: home.state,
      address: home.address
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
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

  AddNewRoom(room: AddRoomDTO): Observable<boolean> {
    if (!room) return of(false);
    const url = 'HomeManagement/Add-NewRoom';
    const body = {
      homeId: room.homeId,
      roomName: room.roomName,
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

    AcceptNewUser(user: UserDTO): Observable<boolean> {
    if (!user) return of(false);
    const url = 'HomeManagement/Add-NewUser';
    const body = {
      homeId: user.homeId,
      newUserId: user.userId,
    };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res) => res ?? false),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(error?.message || 'An unexpected error occurred');
      })
    );
  }

  DeleteUser(user: UserDTO): Observable<boolean> {
    if (!user) return of(false);
    const url = 'HomeManagement/Delete-User';
    const query = {
      homeId: user.homeId,
      newUserId: user.userId,
    };
    return this.apiHttp.delete<boolean>(url, { params: query }).pipe(
      map((res) => res ?? false),
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
}

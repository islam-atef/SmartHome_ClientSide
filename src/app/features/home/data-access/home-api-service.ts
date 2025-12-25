import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HomeDataDTO } from '../models/home-data.dto';
import { HomeSubscriptionRequestDTO } from '../models/home-subscription-request.dto';
import { CreateHome } from '../models/create-home.dto';
import { RenameHomeDto } from '../models/rename-home.dto';
import { AddRoomDTO } from '../models/add-room.dto';
import { AddNewUserDTO as UserDTO } from '../models/user.dto';
import { DeleteRoomDTO } from '../models/delete-room.dto';

@Injectable({
  providedIn: 'root',
})
export class HomeApiService {
  constructor(private apiHttp: ApiHttpService) {}

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

  createNewHome(home: CreateHome): Observable<boolean> {
    if (!home) return of(false);
    const url = 'HomeManagement/Create-NewHome';
    const body = {
      name: home.name,
      longitude: home.longitude,
      latitude: home.latitude,
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

  AddNewUser(user: UserDTO): Observable<boolean> {
    if (!user) return of(false);
    const url = 'HomeManagement/Add-NewUser';
    const body = {
      homeId: user.homeId,
      newUserId: user.newUserId,
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
      newUserId: user.newUserId,
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

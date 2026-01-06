import { Injectable } from '@angular/core';
import { HomeApiService } from '../data-access/home-api-service';
import { HomeDataDTO } from '../models/home-data.dto';
import { HomeSubscriptionRequestDTO } from '../models/home-subscription-request.dto';
import { CreateHome } from '../models/create-home.dto';
import { AddRoomDTO } from '../models/add-room.dto';
import { DeleteRoomDTO } from '../models/delete-room.dto';
import { UserDTO } from '../models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class HomeFacadeService {
  constructor(private homeApi: HomeApiService) {}

  getHomeData(homeId: string): HomeDataDTO {
    this.homeApi.getHomeData(homeId).subscribe({
      next: (res: HomeDataDTO | null) => {
        console.log('HomeFacadeService: getHomeData: result:', res);
        if (res) {
          return res;
        } else {
          console.log('HomeFacadeService: getHomeData: Empty home data');
          return new HomeDataDTO();
        }
      },
      error: (error) =>
        console.log('HomeFacadeService: getHomeData: errors:', error),
    });
    return new HomeDataDTO();
  }

  getHomeAllSubscriptionRequest(homeId: string): HomeSubscriptionRequestDTO[] {
    this.homeApi.getHomeAllSubscriptionRequest(homeId).subscribe({
      next: (res: HomeSubscriptionRequestDTO[] | null) => {
        console.log(
          'HomeFacadeService: getHomeAllSubscriptionRequest: result:',
          res
        );
        if (res) {
          return res;
        } else {
          console.log(
            'HomeFacadeService: getHomeAllSubscriptionRequest: Empty home data'
          );
          return [];
        }
      },
      error: (error) =>
        console.log(
          'HomeFacadeService: getHomeAllSubscriptionRequest: errors:',
          error
        ),
    });
    return [];
  }

  createNewHome(
    homeName: string,
    longitude: number,
    latitude: number
  ): boolean {
    const home: CreateHome = {
      name: homeName,
      longitude: longitude,
      latitude: latitude,
    };
    this.homeApi.createNewHome(home).subscribe({
      next: (res: boolean) => {
        console.log('HomeFacadeService: createNewHome: result:', res);
        if (res) {
          return res;
        } else {
          console.log('HomeFacadeService: createNewHome: Empty home data');
          return false;
        }
      },
      error: (error) =>
        console.log('HomeFacadeService: createNewHome: errors:', error),
    });
    return false;
  }

  addRoom(roomName: string, homeId: string): boolean {
    const room: AddRoomDTO = { homeId: homeId, roomName: roomName };
    this.homeApi.AddNewRoom(room).subscribe({
      next: (res: boolean) => {
        console.log('HomeFacadeService: addRoom: result:', res);
        if (res) {
          return res;
        } else {
          console.log('HomeFacadeService: addRoom: Empty home data');
          return false;
        }
      },
      error: (error) =>
        console.log('HomeFacadeService: addRoom: errors:', error),
    });
    return false;
  }

  DeleteRoom(roomId: string, homeId: string) {
    const room: DeleteRoomDTO = { homeId: homeId, roomId: roomId };
    this.homeApi.DeleteRoom(room).subscribe({
      next: (res: boolean) => {
        console.log('HomeFacadeService: DeleteRoom: result:', res);
        if (res) {
          return res;
        } else {
          console.log('HomeFacadeService: DeleteRoom: Empty home data');
          return false;
        }
      },
      error: (error) =>
        console.log('HomeFacadeService: DeleteRoom: errors:', error),
    });
    return false;
  }

  addUser(userId: string, homeId: string) {
    const user: UserDTO = { userId: userId, homeId: homeId };
    this.homeApi.AddNewUser(user).subscribe({
      next: (res: boolean) => {
        console.log('HomeFacadeService: addUser: result:', res);
        if (res) {
          return res;
        } else {
          console.log('HomeFacadeService: addUser: Empty home data');
          return false;
        }
      },
      error: (error) =>
        console.log('HomeFacadeService: addUser: errors:', error),
    });
    return false;
  }

  deleteUser(userId: string, homeId: string) {
    const user: UserDTO = { userId: userId, homeId: homeId };
    this.homeApi.DeleteUser(user).subscribe({
      next: (res: boolean) => {
        console.log('HomeFacadeService: DeleteUser: result:', res);
        if (res) {
          return res;
        } else {
          console.log('HomeFacadeService: DeleteUser: Empty home data');
          return false;
        }
      },
      error: (error) =>
        console.log('HomeFacadeService: DeleteUser: errors:', error),
    });
    return false;
  }
}

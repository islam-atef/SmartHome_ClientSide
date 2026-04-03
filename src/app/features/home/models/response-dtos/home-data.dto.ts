export class HomeDataDTO {
  homeId: string = '';
  homeName: string = '';
  homeInfo: string = '';
  ownerName: string = '';
  ownerEmail: string = '';
  homeRooms: HomeRoomsDTO[] = [];
  homeUsers: HomeUsersDTO[] = [];
  longitude: number = 0;
  latitude: number = 0;
  country: string = '';
  state: string = '';
  address: string = '';
}

export class HomeRoomsDTO {
  roomId: string = '';
  roomName: string = '';
}

export class HomeUsersDTO {
  userName: string = '';
  userEmail: string = '';
}

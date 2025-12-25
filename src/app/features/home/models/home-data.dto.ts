export class HomeDataDTO {
  homeId: string = '';
  homeName: string = '';
  ownerName: string = '';
  homeRooms: HomeRoomsDTO[] = [];
  homeUsers: string[] = [];
  longitude: number = 0;
  latitude: number = 0;
}

export class HomeRoomsDTO {
  roomId: string = '';
  roomName: string = '';
}

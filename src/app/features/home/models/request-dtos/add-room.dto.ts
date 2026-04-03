export class AddRoomDTO {
  homeId: string = '';
  roomName: string = '';
  accessType: AccessLevel = AccessLevel.Public;
}

export enum AccessLevel {
  Owner = 0,
  Private = 1,
  Public = 2
}

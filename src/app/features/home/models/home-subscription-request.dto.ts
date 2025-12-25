import { Data } from '@angular/router';

export class HomeSubscriptionRequestDTO {
  requestId: string = '';
  HomeId: string = '';
  HomeName: string = '';
  UserId: string = '';
  UserEmail: string = '';
  UserName: string = '';
  RequestDate: Data = new Date();
}

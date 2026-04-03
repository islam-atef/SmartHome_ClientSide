import { Data } from '@angular/router';

export interface HomeSubscriptionDTO {
  requestId: string;
  homeId: string;

  homeName: string;
  userId: string;

  userEmail: string;
  userName: string;

  requestDate: Data;
  requestState: number;
}

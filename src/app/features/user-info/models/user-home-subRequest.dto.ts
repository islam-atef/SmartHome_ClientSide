export class UserHomeSubscriptionRequestDTO {
  requestId: string = '';
  homeId: string = '';
  homeName: string = '';
  requestState: boolean = false;
  requestDate: Date = new Date();
}

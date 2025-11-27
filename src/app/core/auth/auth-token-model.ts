export class authTokenModel {
  accessToken: string = '';
  refreshToken: string = '';
  expiresAtUtc: Date = new Date();
}

export class AuthTokenModel {
  accessToken: string = '';
  refreshToken: string = '';
  expiresAtUtc: Date = new Date();
}

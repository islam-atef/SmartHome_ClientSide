export class AuthTokenModel {
  accessToken: string = '';
  refreshToken: string = '';
  accessTokenExpiresAtUtc: Date = new Date();
}

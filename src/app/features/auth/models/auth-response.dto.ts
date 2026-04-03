export class AuthResponseDto {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  accessTokenExpiresAtUtc: Date | null = null;
  otpQuestionId: string | null = null;
}

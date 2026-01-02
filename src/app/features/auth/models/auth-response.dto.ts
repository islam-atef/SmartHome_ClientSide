export class AuthResponseDto {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  expiresAtUtc: Date | null = null;
  otpQuestionId: string | null = null;
}

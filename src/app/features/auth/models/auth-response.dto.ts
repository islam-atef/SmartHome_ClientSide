export class AuthResponseDto {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  expireAtUtc: Date | null = null;
  otpQuestionId: string | null = null;
}

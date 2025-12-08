export interface LoginResultDto {
  isSuccess: boolean;
  isOtpSent: boolean;
  otpQuestionId: string | null;
  errors: string | null;
}

export interface LoginResultDto {
  isSuccess: boolean;
  otpQuestionId: string;
  errors: string | null;
}

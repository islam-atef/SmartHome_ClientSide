export class ResetPasswordDto {
  userEmail: string | null = null;
  resetPWToken: string | null = null;
  userPassword: string | null = null;
}

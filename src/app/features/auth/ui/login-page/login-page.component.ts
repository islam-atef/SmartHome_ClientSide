import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { AuthFacadeService } from '../../application/auth-facade.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeviceVerificationComponent } from '../device-verification-component/device-verification-component';
import { LoginRequestDto } from '../../models/login-request.dto';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DeviceVerificationComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private formBuilder = inject(FormBuilder);
  private authFacade = inject(AuthFacadeService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  LoginFormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  DeviceCheckFlag: boolean = false;
  OtpQuID: string | null = '';
  hidePassword: boolean = true;

  togglePassword() {
    this.hidePassword = !this.hidePassword;
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.LoginFormGroup.valid) {
      let loginData: LoginRequestDto = {
        email: this.LoginFormGroup.value.email!,
        password: this.LoginFormGroup.value.password!,
      };

      this.authFacade.login(loginData).subscribe((res) => {
        if (res.isSuccess) {
          this.DeviceCheckFlag = false;
          alert('Login successful!');
          this.router.navigate(['/home']);
        } else if (!res.isSuccess && res.isOtpSent) {
          this.OtpQuID = res.otpQuestionId;
          this.DeviceCheckFlag = true;
          this.cdr.detectChanges();
          console.log(
            `OTP sent for device verification. ${this.DeviceCheckFlag}`
          );
          alert(`Device not recognized. Please complete device verification.`);
        } else {
          alert(`Login failed: ${res.errors}`);
        }
      });
    }
  }

  forgotPassword() {
    let email = this.LoginFormGroup.value.email;
    if (email) {
      this.authFacade.sendForgotPWMail(email).subscribe((res: boolean) => {
        if (res) {
          alert(
            'Password reset email sent. \nCheck your inbox to reach the password reset page.'
          );
        } else {
          alert('Failed to send password reset email. Please try again.');
        }
      });
    } else {
      alert('Please enter your email address to reset your password.');
    }
  }
}

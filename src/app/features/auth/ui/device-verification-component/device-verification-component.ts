import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { AuthFacadeService } from '../../application/auth-facade.service';
import { Router } from '@angular/router';
import { OtpAnswerDto } from '../../models/otp-answer.dto';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-device-verification-component',
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatInputModule,
    MatCardContent,
    MatIcon,
    MatFormFieldModule,
  ],
  templateUrl: './device-verification-component.html',
  styleUrl: './device-verification-component.css',
})
export class DeviceVerificationComponent implements OnChanges {
  @Input() OtpQuestionId: string = '';
  private authFacade = inject(AuthFacadeService);
  private router = inject(Router);
  answer: OtpAnswerDto = { otpQuestionId: '', otpAnswer: null! };

  ngOnChanges() {
    this.answer.otpQuestionId = this.OtpQuestionId;
  }

  onSubmitOtp() {
    if (this.answer.otpAnswer === null || this.answer.otpAnswer === undefined) {
      alert('Please enter the OTP answer.');
      return;
    } else {
      this.answer.otpAnswer = Number(this.answer.otpAnswer);
      this.authFacade.sendOtp(this.answer).subscribe((res) => {
        if (res) {
          alert('Device verified successfully! Login complete.');
          this.router.navigate(['']);
        } else {
          alert('Device verification failed. Please try again.');
          this.router.navigate(['/login']);
        }
      });
    }
  }
}

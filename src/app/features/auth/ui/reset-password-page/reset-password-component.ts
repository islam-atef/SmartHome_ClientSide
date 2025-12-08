import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthFacadeService } from '../../application/auth-facade.service';
import { ResetPasswordDto } from '../../models/reset-password.dto';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './reset-password-component.html',
  styleUrl: './reset-password-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private formBuilder = inject(FormBuilder);
  private urlRoute = inject(ActivatedRoute);
  private authFacade = inject(AuthFacadeService);
  private router = inject(Router);

  ResetPasswordFormGroup = this.formBuilder.group({
    password: [''],
    confirmPassword: [''],
  });

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  resetPasswordDto: ResetPasswordDto = {} as ResetPasswordDto;

  ngOnInit(): void {
    this.urlRoute.queryParams.subscribe((params) => {
      this.resetPasswordDto.userEmail = params['email'];
      this.resetPasswordDto.resetPWToken = params['code'];
    });
    this.FormValidation();
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
    this.cdr.detectChanges();
  }
  toggleConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
    this.cdr.detectChanges();
  }

  get _password() {
    return this.ResetPasswordFormGroup.get('password');
  }

  get _confirmPassword() {
    return this.ResetPasswordFormGroup.get('confirmPassword');
  }

  FormValidation() {
    this.ResetPasswordFormGroup = this.formBuilder.group({
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          (control: AbstractControl): ValidationErrors | null => {
            return control.value ===
              this.ResetPasswordFormGroup?.get('password')?.value
              ? null
              : { passwordMismatch: true };
          },
        ],
      ],
    });
  }

  Submit() {
    if (this.ResetPasswordFormGroup.valid) {
      this.resetPasswordDto.userPassword = this._password?.value!;
      this.authFacade.resetPassword(this.resetPasswordDto).subscribe({
        next: (data) => {
          console.log(data);
          if (data) {
            alert('Password Reset Successfully');
            this.ResetPasswordFormGroup.reset();
            this.router.navigate(['login']);
          } else {
            alert('Password Reset Failed');
            this.router.navigate(['login']);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}

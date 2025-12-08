import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthFacadeService } from '../../application/auth-facade.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterDto } from '../../models/register.dto';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InfoCardComponent } from './inner-components/info-card-component/info-card-component';
import { map, Observable, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-register-page-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    InfoCardComponent,
    RouterLink,
  ],
  templateUrl: './register-page-component.html',
  styleUrl: './register-page-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent implements AfterViewChecked {
  private formBuilder = inject(FormBuilder);
  private authFacade = inject(AuthFacadeService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // Create async validators
  private emailAsyncValidator = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    if (!control.value || this.focusField !== 'Email') {
      return of(null);
    }
    // Add debounce delay to avoid checking too frequently
    return timer(500).pipe(
      switchMap(() =>
        this.authFacade
          .checkByEmail(control.value)
          .pipe(map((exists) => (exists ? { emailExists: true } : null)))
      )
    );
  };

  private usernameAsyncValidator = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    if (!control.value || this.focusField !== 'User Name') {
      return of(null);
    }
    // Add debounce delay to avoid checking too frequently
    return timer(500).pipe(
      switchMap(() =>
        this.authFacade
          .checkByUsername(control.value)
          .pipe(map((exists) => (exists ? { usernameExists: true } : null)))
      )
    );
  };

  registerForm = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.email],
      [this.emailAsyncValidator], // Async validator
    ],
    username: [
      '',
      [Validators.required, Validators.minLength(7)],
      [this.usernameAsyncValidator], // Async validator
    ],
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
          return control.value === this.registerForm?.get('password')?.value
            ? null
            : { passwordMismatch: true };
        },
      ],
    ],
    displayname: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    acceptCheckbox: [false, [Validators.requiredTrue]],
  });

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  registerValue: RegisterDto = null as any;
  focusField: string = '';
  onceFlapper = false;
  emailExists: boolean = false;
  usernameExists: boolean = false;

  togglePassword() {
    this.hidePassword = !this.hidePassword;
    this.cdr.detectChanges();
  }
  toggleConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
    this.cdr.detectChanges();
  }

  detectFocus(fieldName: string) {
    this.focusField = fieldName;
    this.cdr.detectChanges();
  }

  get _email() {
    return this.registerForm.get('email');
  }

  get _username() {
    return this.registerForm.get('username');
  }

  get _displayname() {
    return this.registerForm.get('displayname');
  }

  get _password() {
    return this.registerForm.get('password');
  }

  get _confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  ngAfterViewChecked(): void {
    if (!this.onceFlapper) {
      if (
        this._email?.valid &&
        this._username?.valid &&
        this._displayname?.valid &&
        this._password?.valid &&
        this._confirmPassword?.valid
      ) {
        this.focusField = 'Terms and Conditions';
        this.onceFlapper = true;
      }
    }
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.registerValue = {
        email: this.registerForm.value.email!,
        username: this.registerForm.value.username!,
        password: this.registerForm.value.password!,
        displayName: this.registerForm.value.displayname!,
      } as RegisterDto;
      console.log(this.registerValue);
      this.authFacade.register(this.registerValue).subscribe({
        next: () => {
          console.log('Registration successful');
          this.router.navigate(['/authentication/login']);
        },
        error: (error: any) => {
          console.error('Registration failed:', error);
          this.router.navigate(['/authentication/register']);
        },
      });
    }
  }
}

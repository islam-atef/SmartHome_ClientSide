import { Component, Input } from '@angular/core';
import { MatCard, MatCardHeader, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-info-card-component',
  imports: [MatCard, MatCardHeader, MatCardModule],
  templateUrl: './info-card-component.html',
  styleUrl: './info-card-component.css',
})
export class InfoCardComponent {
  @Input() element: string = '';
  password: string = '';
  contentMap: { [key: string]: string } = {
    Email:
      'You need to use a valid gmail account to register for our Smart Home system. This will be used for account verification and communication purposes.',
    'User Name':
      'Choose a unique username that is at least 7 characters long. This will be your identity within our Smart Home community.',
    'Display Name':
      'Create a display name that represents you. It should be at least 3 characters long and will be visible to other users in the system.',
    Password:
      'For your security, create a strong password with at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.',
    'Confirm Password':
      'Please re-enter your password to ensure it matches the one you created. This helps prevent typos and ensures account security.',
    'Terms and Conditions':
      'By checking this box, you agree to our terms and conditions. Please make sure to read and understand them before proceeding with your registration.\n\
      . we will never share your information with third parties without your consent.\n\
      . we will use your information to provide you with the services you have requested.\n\
      . we need to collect certain personal information from you to create and manage your account.\n\
      . we will not sell, rent, or lease your information to third parties.\n\
      . we need to get your location data to provide location-based services.\n\
      . we use browser Identifiers to enhance your user experience on our platform.\n\
      Your privacy is important to us, and we are committed to protecting your personal information.',
  };

  generateRandomPassword() {
    const length = 16;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=1234567890';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    this.password = password;
  }
}

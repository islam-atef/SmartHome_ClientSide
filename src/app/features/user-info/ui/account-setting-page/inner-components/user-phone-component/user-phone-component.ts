import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-phone-component',
  imports: [FormsModule],
  templateUrl: './user-phone-component.html',
  styleUrl: './user-phone-component.css',
})
export class UserPhoneComponent {
  @Input() currentPhoneNumber: string | null = null;
  @Output() phoneNumberUpdated = new EventEmitter<string>();

  onUpdatePhoneNumber(PhoneNumber: string): void {
    console.log('Phone number updated:', PhoneNumber);
    this.phoneNumberUpdated.emit(PhoneNumber);
  }
}

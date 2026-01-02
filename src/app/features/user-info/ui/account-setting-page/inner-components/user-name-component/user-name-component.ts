import { I } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-name-component',
  imports: [FormsModule],
  templateUrl: './user-name-component.html',
  styleUrl: './user-name-component.css',
})
export class UserNameComponent {
  @Input() currentName: string = '';
  @Output() nameUpdated: EventEmitter<string> = new EventEmitter<string>();

  @Input() currentUserName: string = '';
  @Output() userNameUpdated: EventEmitter<string> = new EventEmitter<string>();

  updateName(newName : string) {
    this.nameUpdated.emit(newName);
  }
  updateUserName(newUserName : string) {
    this.userNameUpdated.emit(newUserName);
  }
}

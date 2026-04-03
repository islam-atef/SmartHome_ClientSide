import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeFacadeService } from '../../../../application/home-facade-service';
import { HomeUsersDTO } from '../../../../models/response-dtos/home-data.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InvitationRequestDto } from '../../../../models/request-dtos/invitation-request.dto';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-user-component',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './home-user-component.html',
  styleUrl: './home-user-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeUserComponent {
  constructor(
    private homeFacade: HomeFacadeService,
    private cd: ChangeDetectorRef) { }

  @Input() users: HomeUsersDTO[] = [];
  @Input() isOwner: boolean = false;
  @Input() ownerEmail: string = '';
  @Input() homeId: string = '';

  @Output() usersNotification = new EventEmitter<boolean>();

  userEmail: string = '';

  ngOnInit(): void {

  }



  inviteUser() {
    if (!this.userEmail) return;
    const request: InvitationRequestDto = {
      homeId: this.homeId,
      userEmail: this.userEmail
    };
    this.homeFacade.inviteUser(request).subscribe({
      next: (result) => {
        if (result) {
          this.userEmail = '';
          this.userComponentNotification();
          this.cd.markForCheck();
        }
      },
      error: (err) => console.error('HomeUserComponent: inviteUser error:', err)
    });
  }

  removeUser(userEmail: string) {
    if (!userEmail) return;
    this.homeFacade.deleteUser(this.homeId, userEmail).subscribe({
      next: (result) => {
        if (result) {
          this.userComponentNotification();
          this.cd.markForCheck();
        }
      },
      error: (err) => console.error('HomeUserComponent: removeUser error:', err)
    });
  }

  private userComponentNotification() {
    this.usersNotification.emit(true);
  }
}

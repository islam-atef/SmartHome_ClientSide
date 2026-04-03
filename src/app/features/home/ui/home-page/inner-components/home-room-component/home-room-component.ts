import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeFacadeService } from '../../../../application/home-facade-service';
import { HomeRoomsDTO } from '../../../../models/response-dtos/home-data.dto';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-room-component',
  imports: [RouterModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './home-room-component.html',
  styleUrl: './home-room-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeRoomComponent {
  roomName: string = '';
  constructor(
    private homeFacade: HomeFacadeService,
    private cd: ChangeDetectorRef) { }

  @Input() rooms: HomeRoomsDTO[] = [];
  @Input() homeId: string = '';
  @Input() isOwner: boolean = false;

  @Output() roomsNotification = new EventEmitter<boolean>();

  ngOnInit(): void {
  }

  addRoomToHome(roomName: string) {
    this.homeFacade.addRoom(roomName, this.homeId).subscribe({
      next: (result) => {
        if (result) {
          this.rooms.push({ roomId: result, roomName: roomName });
          this.roomComponentNotification();
          this.cd.markForCheck();
        }
      },
      error: (err) => console.error('HomeRoomComponent: addRoomToHome error:', err)
    });
  }

  removeRoom(roomId: string) {
    this.homeFacade.deleteRoom(roomId, this.homeId).subscribe({
      next: (result) => {
        if (result) {
          this.rooms = this.rooms.filter(room => room.roomId !== roomId);
          this.roomComponentNotification();
          this.cd.markForCheck();
        }
      },
      error: (err) => console.error('HomeRoomComponent: removeRoom error:', err)
    });
  }


  private roomComponentNotification() {
    this.roomsNotification.emit(true);
  }

}

import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SignalrService } from '../../../../core/realtime/signalr/signalr.service';
import { NotificationsStore } from '../../store/notifications.store';
import { NotificationListComponent } from '../notification-list.component/notification-list.component';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [MatIconModule, MatBadgeModule, MatTooltipModule, MatDialogModule],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css',
})
export class NotificationBellComponent implements OnInit {
  private signalrService = inject(SignalrService);
  private notificationsStore = inject(NotificationsStore);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  unreadCount = this.notificationsStore.unreadCount$;

  ngOnInit(): void {
  }

  openNotifications() {
    this.dialog.open(NotificationListComponent, {
      width: '400px',
      maxHeight: '90vh'
    });
  }
}

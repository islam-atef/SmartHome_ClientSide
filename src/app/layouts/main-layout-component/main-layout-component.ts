import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { SignalrService } from '../../core/realtime/signalr/signalr.service';
import { NotificatiosFacadeService } from '../../features/notifications/application/notificatios-facade-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-layout-component',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.css',
})
export class MainLayoutComponent {
  private signalrService = inject(SignalrService);
  private notificationsFacade = inject(NotificatiosFacadeService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar)
  NotificationFlag = this.signalrService.newNotificationFlag$;

  ngOnInit(): void {
    this.signalrService.startNotificationConnection();
    this.signalrService.startRoomDevicesConnection();
    this.signalrService.newNotificationFlag$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((flag) => {
        if (flag) {
          // generate alert
          this.snackBar.open('New Notification', 'Close', {
            duration: 2000,
          });
          // reset the flag
          this.signalrService.setNewNotificationFlag(false);
        }
      });
  }
}

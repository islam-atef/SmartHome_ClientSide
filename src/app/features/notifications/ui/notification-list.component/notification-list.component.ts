import { Component, OnInit, inject, DestroyRef, computed, signal, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SignalrService } from '../../../../core/realtime/signalr/signalr.service';
import { NotificationDTO, NotificationStatus, NotificationType, UserNotifications } from '../../../../shared/models/notification/notification.models';
import { NotificationsStore } from '../../store/notifications.store';
import { NotificatiosFacadeService } from '../../application/notificatios-facade-service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggle, MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonToggleModule
  ],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css',
})
export class NotificationListComponent implements OnInit, OnDestroy {
  protected readonly NotificationStatus = NotificationStatus;
  private signalrService = inject(SignalrService);
  private notificationsStore = inject(NotificationsStore);
  private notificationsFacade = inject(NotificatiosFacadeService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<NotificationListComponent>);

  notifications = this.notificationsStore.notifications$;
  totalCount = this.notificationsStore.totalCount$;
  notificationsCount = this.notificationsStore.storeTotalCount$;
  notificationPages = this.notificationsStore.notificationPages$;

  // Filter and loading state
  selectedStatusFilter = signal<NotificationStatus[]>([NotificationStatus.Unread, NotificationStatus.Seen, NotificationStatus.Read]);
  isLoadingMore = signal<boolean>(false);


  @ViewChild('allToggle') allToggle!: MatButtonToggle;
  @ViewChild('unreadToggle') unreadToggle!: MatButtonToggle;
  @ViewChild('seenToggle') seenToggle!: MatButtonToggle;
  @ViewChild('readToggle') readToggle!: MatButtonToggle;

  // Computed filtered notifications based on status filter
  filteredNotifications = computed(() => {
    const filter = this.selectedStatusFilter();
    const allNotifications = this.notifications();

    if (filter[0] === NotificationStatus.All) {
      return allNotifications;
    }

    return allNotifications.filter(n => filter.includes(n.status));
  });

  ngOnInit(): void {
    // get the notifications from the server
    if (this.notifications().length === 0) { // to avoid duplicate notifications, and to prevent marking new notifications as seen
      this.notificationsFacade.getNotificationsFromServer(1, 10, null).subscribe({
        next: (res: UserNotifications | null | string) => {
          if (!res || typeof res === 'string') return;
          console.log("NotificationListComponent: OnInit: notifications retreived from the server (page 1, pageSize 10, notificationStatus null (all notifications))", res);
          console.log("NotificationListComponent: ngOnInit: notifications", this.notificationsStore.notifications$());
        }
      });
    }
    this.signalrService.notificationReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification) => {
        if (notification) {
          this.notificationsStore.addNewNotification(notification);
          // update notifications count
          this.notificationsStore.setStoreTotalCount(this.notificationsStore.storeTotalCount$() + 1);
          // update page
          if (this.notificationsStore.storeTotalCount$() % 10 === 0) {
            this.notificationsStore.setPage(this.notificationsStore.notificationPages$() + 1);
          }
        }
      });
  }

  ngOnDestroy(): void {
    // make all the notifications as seen
    this.markAllAsSeen(this.notificationsStore.notifications$().map((n) => n.id));
    // clear the notifications unread count
    this.notificationsStore.setUnreadCount(0);
  }

  //#region private markup methods
  markAllAsRead(ids: string[]) {
    if (ids.length === 0) {
      return;
    }
    ids = ids.filter((id) => {
      const status = this.notificationsStore.notifications$()
        .find(n => n.id === id)?.status;

      return status !== NotificationStatus.Read;
    });
    this.notificationsFacade.markAllAsRead(ids).subscribe({
      next: (res) => {
        this.notificationsStore.markNotificationsAsRead(ids);
        console.log("NotificationListComponent: markAllAsRead: notifications marked as read", res);
      },
      error: (error) => {
        console.log("NotificationListComponent: markAllAsRead: error while marking notifications as read", error);
      }
    });
  }

  private markAllAsSeen(ids: string[]) {
    if (ids.length === 0) {
      return;
    }
    ids = ids.filter((id) => {
      const status = this.notificationsStore.notifications$()
        .find(n => n.id === id)?.status;

      return status !== NotificationStatus.Seen &&
        status !== NotificationStatus.Read;
    });

    if (ids.length == 0) return;
    this.notificationsFacade.markAllAsSeen(ids).subscribe({
      next: (res) => {
        this.notificationsStore.markNotificationsAsSeen(ids);
        console.log("NotificationListComponent: markAllAsSeen: notifications marked as seen", res);
      },
      error: (error) => {
        console.log("NotificationListComponent: markAllAsSeen: error while marking notifications as seen", error);
      }
    });
  }


  private markAsSeen(ids: string[]) {
    if (ids.length === 0) {
      return;
    }
    ids = ids.filter((id) => {
      const status = this.notificationsStore.notifications$()
        .find(n => n.id === id)?.status;

      return status !== NotificationStatus.Seen &&
        status !== NotificationStatus.Read;
    });
    this.notificationsFacade.markAllAsSeen(ids).subscribe({
      next: (res) => {
        this.notificationsStore.markNotificationsAsSeen(ids);
        console.log("NotificationListComponent: markAllAsSeen: notifications marked as seen", res);
      },
      error: (error) => {
        console.log("NotificationListComponent: markAllAsSeen: error while marking notifications as seen", error);
      }
    });
  }

  private markAsRead(id: string) {
    if (!id || this.notificationsStore.notifications$().find((notification) => notification.id === id)?.status === NotificationStatus.Read) {
      return;
    }
    this.notificationsFacade.markAsRead(id).subscribe({
      next: (res) => {
        this.notificationsStore.markAsRead(id);
        console.log("NotificationListComponent: markAsRead: notifications marked as read", res);
      },
      error: (error) => {
        console.log("NotificationListComponent: markAsRead: error while marking notifications as read", error);
      }
    });
  }
  //#endregion

  //#region get notifications mechanism
  getOlderNotifications(page: number) {
    if (this.isLoadingMore()) {
      return; // Prevent multiple simultaneous requests
    }

    this.isLoadingMore.set(true);
    this.notificationsFacade.getNotificationsFromServer(page, 10, null).subscribe({
      next: (res) => {
        if (res && typeof res !== 'string') {
          if (res.notifications.length > 0) {
            // mark the coming notification as seen
            this.markAsSeen(res.notifications.map((n) => n.id));
            // add them to the store
            this.notificationsStore.addOldNotifications(res.notifications);
            // update the total count of the notifications
            this.notificationsStore.setStoreTotalCount(this.notificationsStore.storeTotalCount$() + 10);
            // update the page number
            this.notificationsStore.setPage(this.notificationsStore.notificationPages$() + 1);
          }
          this.isLoadingMore.set(false);
        }
      },
      error: () => {
        this.isLoadingMore.set(false);
      }
    });
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const threshold = 150; // pixels from bottom to trigger load

    if (element.scrollHeight - element.scrollTop - element.clientHeight < threshold) {
      if (this.totalCount() > this.notificationsCount()) {
        const nextPage = this.notificationPages() + 1;
        this.getOlderNotifications(nextPage);
      }
    }
  }
  //#endregion

  //#region filter methods
  onFilterChange(status: NotificationStatus, selected: boolean) {
    // ceck the selected value first to know if clicked or unclicked
    if (selected) {
      this.selectedStatusFilter.update((currentStatus) => {
        if (status === NotificationStatus.All) {
          this.unreadToggle.checked = false;
          this.seenToggle.checked = false;
          this.readToggle.checked = false;
          return [NotificationStatus.Unread, NotificationStatus.Seen, NotificationStatus.Read];
        }
        this.allToggle.checked = false;
        if (currentStatus.length === 3) {
          currentStatus = [];
        }
        currentStatus = [...currentStatus, status];
        if (currentStatus.length === 3) {
          this.allToggle.checked = true;
          this.unreadToggle.checked = false;
          this.seenToggle.checked = false;
          this.readToggle.checked = false;
          return [NotificationStatus.Unread, NotificationStatus.Seen, NotificationStatus.Read];
        }
        this.allToggle.checked = false;
        return currentStatus;
      });
    } else {
      this.selectedStatusFilter.update((currentStatus) => {
        if (status === NotificationStatus.All) {
          this.allToggle.checked = false;
          this.unreadToggle.checked = false;
          this.seenToggle.checked = false;
          this.readToggle.checked = false;
          return [];
        }
        return currentStatus.filter((s) => s !== status);
      });
    }
    console.log(this.selectedStatusFilter());
  }

  //#endregion

  getAllNotificationIds(): string[] {
    return this.notifications().map(n => n.id);
  }

  changeNotificationStatus(notification: NotificationDTO) {
    // 1- mark as read
    this.markAsRead(notification.id);
  }

  notificationHandler(notification: NotificationDTO) {
    // 2- according to the notification type navigate to the appropriate page
    switch (notification.type) {
      case NotificationType.HomeInvitationCreated:
        this.router.navigate(['/home', notification.homeId]);
        break;
      case NotificationType.HomeSubscriptionRequestCreated:
        this.router.navigate(['/home', notification.homeId]);
        break;
    }
    // close the modal
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

  //#region delete notification
  deleteNotification(id: string) {
    if (!id) return;
    this.notificationsFacade.deleteNotification(id).subscribe({
      next: (res) => {
        console.log("NotificationListComponent: deleteNotification: notification deleted", res);
        this.notificationsStore.deleteNotification(id);
      },
      error: (error) => {
        console.log("NotificationListComponent: deleteNotification: error while deleting notification", error);
      }
    });
  }
  //#endregion
}
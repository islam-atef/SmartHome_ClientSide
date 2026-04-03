import { Injectable } from '@angular/core';
import { NotificationsAPIService } from '../data-access/notifications-api-service';
import { Observable, tap } from 'rxjs';
import { NotificationDTO, NotificationStatus, UserNotifications } from '../../../shared/models/notification/notification.models';
import { NotificationsStore } from '../store/notifications.store';

@Injectable({
  providedIn: 'root',
})
export class NotificatiosFacadeService {
  constructor(private apiService: NotificationsAPIService, private store: NotificationsStore) { }

  //#region get notifications methods
  getNotificationsFromServer(page: number, pageSize: number, notificationStatus: NotificationStatus[] | null): Observable<UserNotifications | null | string> {
    return this.apiService.getNotifications(page, pageSize, notificationStatus).pipe(
      tap((res: UserNotifications | null | string) => {
        if (res && typeof res !== 'string') {
          if (res.notifications.length > 0) {
            this.store.setNotifications(res.notifications);
          }
          this.store.setTotalCount(res.totalCount);
        }
      })
    );
  }

  getMyUnreadNotificationsCount(): Observable<number | null | string> {
    return this.apiService.getMyUnreadNotificationsCount().pipe(
      tap((res: number | null | string) => {
        if (res && typeof res === 'number') {
          this.store.setUnreadCount(res);
        }
      })
    );
  }

  getMySeenNotificationsCount(): Observable<number | null | string> {
    return this.apiService.getMySeenNotificationsCount();
  }

  //#endregion

  //#region update notifications status methods
  markAsRead(notificationId: string): Observable<boolean> {
    return this.apiService.markAsRead(notificationId).pipe(
      tap(() => {
        this.store.markAsRead(notificationId);
      })
    );
  }

  markAsSeen(notificationId: string): Observable<boolean> {
    return this.apiService.markAsSeen(notificationId).pipe(
      tap(() => {
        this.store.markAsSeen(notificationId);
      })
    );
  }

  markAllAsRead(notificationIds: string[]): Observable<boolean> {
    return this.apiService.markAllAsRead(notificationIds).pipe(
      tap(() => {
        this.store.markNotificationsAsRead(notificationIds);
      })
    );
  }

  markAllAsSeen(notificationIds: string[]): Observable<boolean> {
    return this.apiService.markAllAsSeen(notificationIds).pipe(
      tap(() => {
        this.store.markNotificationsAsSeen(notificationIds);
      })
    );
  }
  //#endregion

  //#region delete notifications methods
  deleteNotifications(notificationIds: string[]): Observable<boolean | null | string> {
    return this.apiService.deleteNotifications(notificationIds).pipe(
      tap(() => {
        this.store.deleteNotifications(notificationIds);
      })
    );
  }

  deleteNotification(notificationId: string): Observable<boolean | null | string> {
    const Id: string[] = [notificationId];
    return this.apiService.deleteNotifications(Id).pipe(
      tap(() => {
        this.store.deleteNotification(notificationId);
      })
    );
  }

  deleteReadNotifications(): Observable<boolean | null | string> {
    return this.apiService.deleteReadNotifications().pipe(
      tap(() => {
        this.store.deleteReadNotifications();
      })
    );
  }
  //#endregion
}

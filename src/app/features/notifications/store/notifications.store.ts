import { Injectable, signal } from '@angular/core';
import { NotificationDTO, NotificationStatus } from '../../../shared/models/notification/notification.models';

@Injectable({
  providedIn: 'root',
})
export class NotificationsStore {
  private notifications = signal<NotificationDTO[]>([]);
  readonly notifications$ = this.notifications.asReadonly();

  private unreadCount = signal<number>(0);
  readonly unreadCount$ = this.unreadCount.asReadonly();

  private totalCount = signal<number>(0);
  readonly totalCount$ = this.totalCount.asReadonly();
  setTotalCount(count: number) {
    this.totalCount.set(count);
  }

  private notificationPages = signal<number>(0);
  readonly notificationPages$ = this.notificationPages.asReadonly();
  setPage(page: number) {
    this.notificationPages.set(page);
  }

  private storeTotalCount = signal<number>(0);
  readonly storeTotalCount$ = this.storeTotalCount.asReadonly();
  setStoreTotalCount(count: number) {
    this.storeTotalCount.set(count);
  }

  //#region Setters
  addNewNotification(notification: NotificationDTO) {
    this.notifications.update((notifications) => [notification, ...notifications]);
    if (notification.status === NotificationStatus.Unread) {
      this.unreadCount.update((count) => count + 1);
    }
  }

  setNotifications(notifications: NotificationDTO[]) {
    this.notifications.set(notifications);
  }

  addOldNotifications(olderNotifications: NotificationDTO[]) {
    this.notifications.update((current) => {
      // 1. Prevent duplicates (Filter out ones already in the store)
      const existingIds = new Set(current.map(n => n.id));
      const uniqueOlder = olderNotifications.filter(n => !existingIds.has(n.id));
      // 2. Keep state integrity (Update unread count)
      const newUnreadCount = uniqueOlder.filter(n => n.status === NotificationStatus.Unread).length;
      if (newUnreadCount > 0) {
        this.unreadCount.update(count => count + newUnreadCount);
      }
      // 3. Append to the end (since these are "older" notifications)
      return [...current, ...uniqueOlder];
    });
  }

  setUnreadCount(count: number) {
    this.unreadCount.set(count);
  }
  //#endregion

  //#region Delete Notifications
  deleteNotification(id: string) {
    const notification = this.notifications().find(n => n.id === id);
    if (notification && notification.status === NotificationStatus.Unread) {
      this.unreadCount.update((count) => count - 1);
    }
    this.notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  }

  deleteNotifications(ids: string[]) {
    const unreadToDelete = this.notifications().filter(n => ids.includes(n.id) && n.status === NotificationStatus.Unread).length;
    this.unreadCount.update((count) => count - unreadToDelete);
    this.notifications.update((notifications) => notifications.filter((n) => !ids.includes(n.id)));
  }

  deleteReadNotifications() {
    this.notifications.update((notifications) => notifications.filter((n) => n.status !== NotificationStatus.Read));
    this.unreadCount.set(0);
  }
  //#endregion

  //#region Mark as Read
  markAsRead(id: string) {
    this.notifications.update((notifications) => notifications.map((n) => {
      if (n.id === id && n.status !== NotificationStatus.Read) {
        if (n.status === NotificationStatus.Unread) {
          this.unreadCount.update((count) => count - 1);
        }
        return { ...n, status: NotificationStatus.Read };
      }
      return n;
    }));
  }

  markNotificationsAsRead(ids: string[]) {
    this.notifications.update((notifications) => notifications.map((n) => {
      if (ids.includes(n.id) && n.status !== NotificationStatus.Read) {
        if (n.status === NotificationStatus.Unread) {
          this.unreadCount.update((count) => count - 1);
        }
        return { ...n, status: NotificationStatus.Read };
      }
      return n;
    }));
  }

  markAllAsRead() {
    this.notifications.update((notifications) => notifications.map((notification) => ({ ...notification, status: NotificationStatus.Read })));
    this.unreadCount.set(0);
  }
  //#endregion

  //#region Mark as seen
  markAsSeen(id: string) {
    this.notifications.update((notifications) => notifications.map((notification) => notification.id === id ? { ...notification, status: NotificationStatus.Seen } : notification));
  }

  markNotificationsAsSeen(ids: string[]) {
    this.notifications.update((notifications) => notifications.map((notification) => ids.includes(notification.id) ? { ...notification, status: NotificationStatus.Seen } : notification));
  }

  markAllAsSeen() {
    this.notifications.update((notifications) => notifications.map((notification) => ({ ...notification, status: NotificationStatus.Seen })));
  }
  //#endregion

  //#region Clear Notifications
  clearNotifications() {
    this.notifications.set([]);
    this.unreadCount.set(0);
  }
  //#endregion

}

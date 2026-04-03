import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { NotificationDTO, NotificationStatus, UserNotifications } from '../../../shared/models/notification/notification.models';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsAPIService {
  constructor(private apiHttp: ApiHttpService) { }

  //#region get notifications methods
  getNotifications(page: number, pageSize: number, notificationStatus: NotificationStatus[] | null): Observable<UserNotifications | null | string> {
    if (page <= 0 || pageSize <= 0) return of(null);
    if (pageSize > 10) pageSize = 10;
    const url = 'Notifications/GetMyNotifications';

    const params: any = { page, pageSize };
    if (notificationStatus && notificationStatus.length > 0) {
      params.notificationStatus = notificationStatus;
    }

    return this.apiHttp.get<UserNotifications>(url, { params }).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(`NotificationsAPIService: getNotifications: ${error?.message}`);
      })
    );
  }

  getMyUnreadNotificationsCount(): Observable<number | null | string> {
    const url = 'Notifications/GetMyUnreadCount';
    return this.apiHttp.get<number>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(`NotificationsAPIService: getMyUnreadNotificationsCount: ${error?.message}`);
      })
    );
  }

  getMySeenNotificationsCount(): Observable<number | null | string> {
    const url = 'Notifications/GetMySeenCount';
    return this.apiHttp.get<number>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(`NotificationsAPIService: getMySeenNotificationsCount: ${error?.message}`);
      })
    );
  }
  //#endregion

  //#region update notifications status methods
  markAsRead(notificationId: string): Observable<boolean> {
    const url = 'Notifications/MarkAsRead';
    const body = { notificationId: notificationId };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res: boolean) => res)
    );
  }

  markAsSeen(notificationId: string): Observable<boolean> {
    const url = 'Notifications/MarkAsSeen';
    const body = { notificationId: notificationId };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res: boolean) => res)
    );
  }

  markAllAsRead(notificationIds: string[]): Observable<boolean> {
    const url = 'Notifications/MarkAllAsRead';
    const body = { notificationIds: notificationIds };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res: boolean) => res)
    );
  }

  markAllAsSeen(notificationIds: string[]): Observable<boolean> {
    const url = 'Notifications/MarkAllAsSeen';
    const body = { notificationIds: notificationIds };
    return this.apiHttp.post<boolean>(url, body).pipe(
      map((res: boolean) => res)
    );
  }
  //#endregion

  //#region delete notifications methods
  deleteNotifications(notificationIds: string[]): Observable<boolean | null | string> {
    const url = 'Notifications/DeleteNotifications';
    const body = { notificationIds: notificationIds };
    return this.apiHttp.delete<boolean>(url, { body }).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(`NotificationsAPIService: deleteNotifications: ${error?.message}`);
      })
    );
  }

  deleteReadNotifications(): Observable<boolean | null | string> {
    const url = 'Notifications/DeleteReadNotifications';
    return this.apiHttp.delete<boolean>(url).pipe(
      map((res) => res ?? null),
      tap((res) => console.log(res)),
      catchError((error) => {
        return of(`NotificationsAPIService: deleteReadNotifications: ${error?.message}`);
      })
    );
  }
  //#endregion
}

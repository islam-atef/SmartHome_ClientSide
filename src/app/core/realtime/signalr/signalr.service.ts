import { Injectable } from '@angular/core';
import { TokenStoreService } from '../../auth/tokenStoreService/token-store.service';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { NotificationDTO } from '../../../shared/models/notification/notification.models';
import { environment } from '../../../../environments/environment.development';
import { NotificationsStore } from '../../../features/notifications/store/notifications.store';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  constructor(private tokenStore: TokenStoreService, private notificationsStore: NotificationsStore) { }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //#region (1) Notification Section

  //#region (1.1) Notification Subjects
  private notificationReceived = new BehaviorSubject<NotificationDTO | null>(null);
  notificationReceived$ = this.notificationReceived.asObservable();

  // Unread Count Subjects
  private unreadCountUpdated = new BehaviorSubject<number | null>(null);
  unreadCountUpdated$ = this.unreadCountUpdated.asObservable();

  // new notification flag
  private newNotificationFlag = new BehaviorSubject<boolean>(false);
  newNotificationFlag$ = this.newNotificationFlag.asObservable();
  setNewNotificationFlag(flag: boolean) {
    this.newNotificationFlag.next(flag);
  }

  // connection status
  private connectionStatus = new BehaviorSubject<boolean>(false);
  connectionStatus$ = this.connectionStatus.asObservable();

  //#endregion

  //#region (1.2) start connections: notification hub start connection

  // Hub Connections
  private notificationsHubConnection: HubConnection | undefined;

  // start notification connection
  async startNotificationConnection() {
    const token = this.getAccessToken();

    if (this.notificationsHubConnection && this.notificationsHubConnection.state === 'Connected') {
      console.log('SignalrService: startNotificationConnection: Notification Hub already connected');
      return;
    } else {
      console.log('SignalrService: startNotificationConnection: Notification Hub will start connection with the server at:', new Date().toUTCString());
    }

    this.notificationsHubConnection = this.createConnection(environment.notificationsHubUrl, token);

    // register handlers
    // 1- Receive Notification Handler
    this.notificationsHubConnection.on('NotificationReceived', (notification: NotificationDTO) => {
      this.notificationReceived.next(notification);
      this.newNotificationFlag.next(true);
    });

    // 2- Receive Unread Notification Counter Handler
    this.notificationsHubConnection.on('UnreadCountUpdated', (count: number) => {
      this.unreadCountUpdated.next(count);
      this.notificationsStore.setUnreadCount(count);
    });

    // connection state handlers
    // 1- reconnection Error Handler
    this.notificationsHubConnection.onreconnecting((error) => {
      this.connectionStatus.next(false);
      console.log('SignalrService: startNotificationConnection: Notification Hub Reconnecting...', error);
    });

    // 2- reconnetion Success Handler
    this.notificationsHubConnection.onreconnected((connectionId) => {
      this.connectionStatus.next(true);
      console.log('SignalrService: startNotificationConnection: Notification Hub Reconnected!', connectionId);
      // Group is automatically rejoined by OnConnectedAsync
    });

    // 3- connention End handler
    this.notificationsHubConnection.onclose((error) => {
      this.connectionStatus.next(false);
      console.log('SignalrService: startNotificationConnection: Notification Hub Connection Closed', error);
      // Group is automatically left by OnConnectedAsync
    });

    // start connection
    try {
      await this.notificationsHubConnection.start();
      this.connectionStatus.next(true);
      console.log('SignalrService: startNotificationConnection: Notification Hub Connected');
    } catch (err) {
      this.connectionStatus.next(false);
      console.error('SignalrService: startNotificationConnection: Error while starting Notification Hub connection: ' + err);
    }
  }
  //#endregion

  //#region (1.3) stop connections
  stopNotificationConnections() {
    if (this.notificationsHubConnection) {
      this.notificationsHubConnection.stop();
      this.connectionStatus.next(false);
    }
  }
  //#endregion

  //#region (1.4) Connection State Getters
  get isNotificationHubConnected(): boolean {
    return this.notificationsHubConnection?.state === 'Connected';
  }
  //#endregion

  //#endregion

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //#region (2) Room section

  //#region (2.1) room devices hub connection

  // Hub Connection
  private roomsHubConnection: HubConnection | undefined;

  // Start Connection
  async startRoomDevicesConnection() {
    const token = this.getAccessToken();

    if (this.roomsHubConnection && this.roomsHubConnection.state === 'Connected') return;

    this.roomsHubConnection = this.createConnection(environment.roomsHubUrl, token);

    // TODO: Register generic handlers for room devices here if needed
    // this.roomDevicesHubConnection.on('SomeEvent', (data) => ...);

    this.roomsHubConnection.onreconnecting((error) => {
      console.log('Room Devices Hub Reconnecting...', error);
    });
    this.roomsHubConnection.onreconnected((connectionId) => {
      console.log('Room Devices Hub Reconnected!', connectionId);
    });
    this.roomsHubConnection.onclose((error) => {
      console.log('Room Devices Hub Connection Closed', error);
    });

    try {
      await this.roomsHubConnection.start();
      console.log('Room Devices Hub Connected');
    } catch (err) {
      console.error('Error while starting Room Devices Hub connection: ' + err);
    }
  }
  //#endregion

  //#region (2.2) join/leave groups [Not completed yet]
  async joinRoomDevicesGroup(roomId: string) {
    if (!this.roomsHubConnection) {
      console.error('SignalrService: joinRoomDevicesGroup: Room Devices Hub not connected');
      return;
    }

    try {
      await this.roomsHubConnection.invoke('JoinRoomDevicesGroup', roomId);
      console.log('Joined room devices group:', roomId);
    } catch (err) {
      console.error('Error while joining room devices group:', err);
    }
  }

  async leaveRoomDevicesGroup(roomId: string) {
    if (!this.roomsHubConnection) {
      console.error('SignalrService: leaveRoomDevicesGroup: Room Devices Hub not connected');
      return;
    }

    try {
      await this.roomsHubConnection.invoke('LeaveRoomDevicesGroup', roomId);
      console.log('Left room devices group:', roomId);
    } catch (err) {
      console.error('Error while leaving room devices group:', err);
    }
  }

  //#endregion

  //#region (2.3) stop connections
  stopRoomDevicesConnections() {
    if (this.roomsHubConnection) {
      this.roomsHubConnection.stop();
    }
  }

  //#endregion

  //#region (2.4) Connection State Getters
  get isRoomDevicesHubConnected(): boolean {
    return this.roomsHubConnection?.state === 'Connected';
  }
  //#endregion

  //#endregion

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //#region (3) private methods

  //#region (3.1) Create Connection
  private createConnection(url: string, token: string): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => token || '',
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();
  }
  //#endregion

  //#region (3.2) Access token method:
  private getAccessToken(): string {
    const token = this.tokenStore.getTokens()?.accessToken;
    if (!token) {
      console.error('SignalrService: startRoomDevicesConnection: No token found');
      return '';
    }
    return token;
  }
  //#endregion

  //#endregion

}

export interface NotificationDTO {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    status: NotificationStatus;
    refType: NotificationRefType;
    refId: string;
    homeId: string;
    createdAtUtc: Date;
    updatedAtUtc: Date;
}

export interface UserNotifications {
    notifications: NotificationDTO[];
    totalCount: number;
}

export enum NotificationType {
    HomeInvitationCreated = 1,
    HomeInvitationAccepted = 2,
    HomeInvitationRejected = 3,
    HomeSubscriptionRequestCreated = 11,
    HomeSubscriptionRequestAccepted = 12,
    HomeSubscriptionRequestRejected = 13,
    System = 21,
    DeviceAlert = 31
}

export enum NotificationStatus {
    Unread = 1,
    Seen = 2,
    Read = 3,
    All = 4
}

export enum NotificationRefType {
    HomeInvitationEntity = 0,
    HomeSubscriptionRequestEntity = 1,
    System = 2,
    ControlUnitEntity = 3
}

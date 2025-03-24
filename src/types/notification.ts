export interface NotificationType {
    notificationId: number;
    ntId: number;
    title: string;
    description: string;
    contentHtml: string;
    createdAt: string;
    lastSentTime: string;
    notiTypeValue: string;
    isRead: boolean;
    readAt: string;
}

export interface NotificationMessage {
    NotificationId: number;
    NotificationType: string;
    Title: string;
    Description: string;
    ContentHtml: string;
    LastSentTime: string;
}

export interface NotificationListResponse {
    success: boolean;
    error?: string;
    data?: NotificationType[];
}


export interface NotiType {
    ntId: number;
    value: number
}

export interface NotiAdminType {
    notificationId: number;
    ntId: number;
    title: string;
    description: string;
    contentHtml: string;
    createdAt: string;
    lastSentTime: string;
    notiTypeValue: string;
}


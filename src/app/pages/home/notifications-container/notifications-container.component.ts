import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Notification } from '../../../models/notification.model';

@Component({
  selector: 'app-notifications-container',
  standalone: false,
  templateUrl: './notifications-container.component.html',
  styleUrl: './notifications-container.component.scss',
})
export class NotificationsContainerComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.apiService.getNotifications().subscribe({
      next: (data) => (this.notifications = data),
      error: (err) => console.error('Erreur de chargement des notifs', err),
    });
  }

  markAsRead(notificationId: number): void {
    this.apiService.markNotificationAsRead(notificationId).subscribe(() => {
      const notif = this.notifications.find((n) => n.id === notificationId);
      if (notif) notif.read = true;
    });
  }

  markAllAsRead(): void {
    this.apiService.markAllNotificationsAsRead().subscribe(() => {
      this.notifications.forEach((n) => (n.read = true));
    });
  }

  delete(notificationId: number): void {
    this.apiService.deleteNotification(notificationId).subscribe(() => {
      this.notifications = this.notifications.filter(
        (n) => n.id !== notificationId
      );
    });
  }
}

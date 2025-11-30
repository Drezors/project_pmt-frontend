import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsContainerComponent } from './notifications-container.component';
import { ApiService } from '../../../services/api.service';
import { of } from 'rxjs';
import { Notification } from '../../../models/notification.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotificationsContainerComponent', () => {
  let component: NotificationsContainerComponent;
  let fixture: ComponentFixture<NotificationsContainerComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockNotifications: Notification[] = [
    { id: 1, userId: 1, message: 'Notification 1', read: false },
    { id: 2, userId: 1, message: 'Notification 2', read: true },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', [
      'getNotifications',
      'markNotificationAsRead',
      'markAllNotificationsAsRead',
      'deleteNotification',
    ]);

    await TestBed.configureTestingModule({
      declarations: [NotificationsContainerComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsContainerComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    apiServiceSpy.getNotifications.and.returnValue(of(mockNotifications));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notifications on init', () => {
    expect(component.notifications.length).toBe(2);
    expect(component.notifications[0].message).toBe('Notification 1');
  });

  it('should mark a notification as read', () => {
    apiServiceSpy.markNotificationAsRead.and.returnValue(of(void 0));
    component.markAsRead(1);
    expect(apiServiceSpy.markNotificationAsRead).toHaveBeenCalledWith(1);
    expect(component.notifications.find((n) => n.id === 1)?.read).toBeTrue();
  });

  it('should mark all notifications as read', () => {
    apiServiceSpy.markAllNotificationsAsRead.and.returnValue(of(void 0));
    component.markAllAsRead();
    component.notifications.forEach((n) => {
      expect(n.read).toBeTrue();
    });
  });

  it('should delete a notification', () => {
    apiServiceSpy.deleteNotification.and.returnValue(of(void 0));
    component.delete(1);
    expect(apiServiceSpy.deleteNotification).toHaveBeenCalledWith(1);
    expect(component.notifications.find((n) => n.id === 1)).toBeUndefined();
  });
});

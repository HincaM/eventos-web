import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { UiAlert } from '../alert/alert';

@Component({
  selector: 'ui-notification-toast',
  imports: [UiAlert],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080;">
      @for (notification of notificationService.notifications(); track notification.id) {
        <ui-alert
          [message]="notification.message"
          [variant]="notification.variant"
          (dismissed)="notificationService.dismiss(notification.id)"
        />
      }
    </div>
  `,
})
export class UiNotificationToast {
  protected readonly notificationService = inject(NotificationService);
}

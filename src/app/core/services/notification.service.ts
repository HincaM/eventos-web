import { Injectable, signal } from '@angular/core';

export type NotificationVariant = 'success' | 'danger' | 'warning' | 'info';

export interface Notification {
  id: number;
  message: string;
  variant: NotificationVariant;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly nextId = signal(1);
  private readonly notificationsSignal = signal<Notification[]>([]);

  readonly notifications = this.notificationsSignal.asReadonly();

  show(message: string, variant: NotificationVariant = 'info'): void {
    const id = this.nextId();
    this.nextId.set(id + 1);
    this.notificationsSignal.update((current) => [...current, { id, message, variant }]);
    setTimeout(() => this.dismiss(id), 6000);
  }

  dismiss(id: number): void {
    this.notificationsSignal.update((current) => current.filter((notification) => notification.id !== id));
  }
}

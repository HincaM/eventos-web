import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { UiNotificationToast } from './shared/components/notification-toast/notification-toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UiNotificationToast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly loadingService = inject(LoadingService);
}

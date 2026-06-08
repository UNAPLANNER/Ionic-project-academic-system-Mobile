import { Component } from '@angular/core';
import { NotificationService } from './core/services/notification.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private notificationService: NotificationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.notificationService.initPush();
  }
}

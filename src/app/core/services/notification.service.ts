import { Injectable } from '@angular/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed
} from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  async initializePushNotifications() {

    //  Apply for permits
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive !== 'granted') {
      console.log('Push notification permission denied');
      return;
    }

    // Register device
    await PushNotifications.register();

    // Token generated
    PushNotifications.addListener(
      'registration',
      (token: Token) => {
        console.log('FCM Device Token:', token.value);
      }
    );

    // Error register
    PushNotifications.addListener(
      'registrationError',
      (error) => {
        console.error('Registration error:', error);
      }
    );

    // Notification received
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received:', notification);
      }
    );

    // User taps the notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed', notification);
      }
    );
  }
}
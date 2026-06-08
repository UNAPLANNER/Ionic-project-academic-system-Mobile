import { Injectable } from '@angular/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed
} from '@capacitor/push-notifications';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  async initPush() {

    // Solicitar permisos
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive !== 'granted') {
      console.log('Permiso denegado');
      return;
    }

    // Registrar dispositivo en Firebase
    await PushNotifications.register();

    // Obtener el token del dispositivo
    PushNotifications.addListener(
      'registration',
      async (token: Token) => {

        console.log('Device Token:', token.value);

        try {

          const user = this.authService.getCurrentUser();

          if (!user) {
            console.log('No hay usuario autenticado');
            return;
          }

          await this.apiService.saveDeviceToken(
           user.id,
            token.value
          );

          console.log('Token guardado correctamente');

        } catch (error) {
          console.error('Error guardando token:', error);
        }

      }
    );

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log(notification);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log(notification);
      }
    );
  }
}
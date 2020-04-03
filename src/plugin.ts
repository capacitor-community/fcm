import { Plugins } from '@capacitor/core';
import { FCMProtocol } from './definitions';

const { FCMPlugin } = Plugins;

export class FCM implements FCMProtocol {

  /**
   * Subscribe to fcm topic
   * @param options 
   */
  subscribeTo(options: { topic: string }): Promise<{ message: string }> {
    return FCMPlugin.subscribeTo({ topic: options.topic });
  }

  /**
   * Unsubscribe from fcm topic
   * @param options 
   */
  unsubscribeFrom(options: { topic: string }): Promise<{ message: string }> {
    return FCMPlugin.unsubscribeFrom({ topic: options.topic });
  }

  /**
   * Get fcm token to eventually use from a serve
   * 
   * Recommended to use this instead of 
   * @usage
   * ```typescript
   * PushNotifications.addListener("registration", (token) => {
   *   console.log(token.data);
   * });
   * ``` 
   * because the native capacitor method, for apple, returns the APN's token
   */
  getToken(): Promise<{ token: string }> {
    return FCMPlugin.getToken();
  }

  /**
   * Remove local fcm instance completely
   */
  deleteInstance(): Promise<any> {
    return FCMPlugin.deleteInstance();
  }

  /**
   * Open system settings for this app
   */
  openSettings(): Promise<any> {
    return FCMPlugin.openSettings();
  }
}

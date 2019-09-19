import { Plugins } from '@capacitor/core';
import { FCMProtocol } from './definitions';

const { FCMPlugin } = Plugins;

export class FCM implements FCMProtocol {

  /**
   * Subscribe to fcm topic
   * @param options 
   */
  subscribeTo(options: { topic: string }): Promise<any> {
    return FCMPlugin.subscribeTo({ topic: options.topic });
  }

  /**
   * Unsubscribe from fcm topic
   * @param options 
   */
  unsubscribeFrom(options: { topic: string }): Promise<any> {
    return FCMPlugin.unsubscribeFrom({ topic: options.topic });
  }

  /**
   * Get fcm token to eventually use from a serve
   */
  getToken(): Promise<any> {
    return FCMPlugin.getToken();
  }

  /**
   * Remove local fcm instance completely
   */
  deleteInstance(): Promise<any> {
    return FCMPlugin.deleteInstance();
  }
}

import { Plugins } from '@capacitor/core';
import { FCMProtocol } from './definitions';

const { FCMPlugin } = Plugins;

export class FCM implements FCMProtocol {
  subscribeTo(options: { topic: string }) {
    console.log(123, FCMPlugin);
    return FCMPlugin.subscribeTo({ topic: options.topic });
  }
  unsubscribeFrom(options: { topic: string }) {
    return FCMPlugin.unsubscribeFrom({ topic: options.topic });
  }
  getToken() {
    return FCMPlugin.getToken();
  }

  /**
   * only androidy
   */
  deleteInstance() {
    return FCMPlugin.deleteInstance();
  }
}

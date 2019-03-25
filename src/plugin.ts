import { Plugins } from "@capacitor/core";
import { IFCMPlugin } from "./definitions";

const { FCMPlugin } = Plugins;

export class FCM implements IFCMPlugin {
  subscribeTo(options: { topic: string }) {
    return FCMPlugin.subscribeTo({ topic: options.topic });
  }
  unsubscribeFrom(options: { topic: string }) {
    return FCMPlugin.unsubscribeFrom({ topic: options.topic });
  }
  getToken() {
    return FCMPlugin.getToken();
  }
}

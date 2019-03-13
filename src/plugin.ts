import { Plugins } from "@capacitor/core";
import { IFCMPlugin } from "./definitions";

const { FCMPlugin } = Plugins;

export class FCM implements IFCMPlugin {
  subscribeTo(options: { topic: string }): Promise<any> {
    return FCMPlugin.subscribeTo({ topic: options.topic });
  }
  unsubscribeFrom(options: { topic: string }): Promise<any> {
    return FCMPlugin.unsubscribeFrom({ topic: options.topic });
  }
}

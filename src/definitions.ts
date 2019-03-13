declare global {
  interface PluginRegistry {
    FCMPlugin?: IFCMPlugin;
  }
}

export interface IFCMPlugin {
  subscribeTo(options: { topic: string }): Promise<any>;
  unsubscribeFrom(options: { topic: string }): Promise<any>;
}

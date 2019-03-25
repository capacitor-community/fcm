declare global {
  interface PluginRegistry {
    FCMPlugin?: IFCMPlugin;
  }
}

export interface IFCMPlugin {
  subscribeTo(options: { topic: string }): Promise<{ message: string }>;
  unsubscribeFrom(options: { topic: string }): Promise<{ message: string }>;
  getToken(): Promise<{ token: string }>;
}

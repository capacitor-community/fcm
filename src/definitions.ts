declare module '@capacitor/core' {
  interface PluginRegistry {
    FCMPlugin: FCMProtocol;
  }
}

export interface FCMProtocol {
  subscribeTo(options: { topic: string }): Promise<{ message: string }>;
  unsubscribeFrom(options: { topic: string }): Promise<{ message: string }>;
  /**
   * @deprecated
   */
  getToken(): Promise<{ token: string }>;
  deleteInstance(): Promise<boolean>;
}

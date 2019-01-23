declare global {
  interface PluginRegistry {
    FCMPlugin?: IFCMPlugin;
  }
}

export interface IFCMPlugin {
  subscribeTo(options: { topic: string }): Promise<any>;
}

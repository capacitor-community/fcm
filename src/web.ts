import { WebPlugin } from '@capacitor/core';
import { FCMPlugin } from './definitions';

export class FCMWeb extends WebPlugin implements FCMPlugin {
  constructor() {
    super({
      name: 'FCM',
      platforms: ['web'],
    });
  }

  subscribeTo(_options: { topic: string }): Promise<{ message: string }> {
    throw this.unimplemented('Not implemented on web.');
  }

  unsubscribeFrom(_options: { topic: string }): Promise<{ message: string }> {
    throw this.unimplemented('Not implemented on web.');
  }

  getToken(): Promise<{ token: string }> {
    throw this.unimplemented('Not implemented on web.');
  }

  deleteToken(): Promise<boolean> {
    throw this.unimplemented('Not implemented on web.');
  }

  deleteInstance(): Promise<boolean> {
    throw this.unimplemented('Not implemented on web.');
  }

  setAutoInit(_options: { enabled: boolean }): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  isAutoInitEnabled(): Promise<{ enabled: boolean }> {
    throw this.unimplemented('Not implemented on web.');
  }

  refreshToken(): Promise<{ token: string }> {
    throw this.unimplemented('Not implemented on web.');
  }
}

const FCM = new FCMWeb();

export { FCM };

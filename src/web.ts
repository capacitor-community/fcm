import { WebPlugin } from '@capacitor/core';
import { FCMPlugin } from './definitions';

export class FCMWeb extends WebPlugin implements FCMPlugin {
  constructor() {
    super({
      name: 'FCM',
      platforms: ['web']
    });
  }

  async echo(options: { value: string }): Promise<{value: string}> {
    console.log('ECHO', options);
    return Promise.resolve({ value: options.value });
  }
}

const FCM = new FCMWeb();

export { FCM };

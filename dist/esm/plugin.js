import { Plugins } from '@capacitor/core';
const { FCMPlugin } = Plugins;
export class FCM {
    subscribeTo(options) {
        console.log(123, FCMPlugin);
        return FCMPlugin.subscribeTo({ topic: options.topic });
    }
    unsubscribeFrom(options) {
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
//# sourceMappingURL=plugin.js.map
import { FCMProtocol } from './definitions';
export declare class FCM implements FCMProtocol {
    /**
     * Subscribe to fcm topic
     * @param options
     */
    subscribeTo(options: {
        topic: string;
    }): Promise<any>;
    /**
     * Unsubscribe from fcm topic
     * @param options
     */
    unsubscribeFrom(options: {
        topic: string;
    }): Promise<any>;
    /**
     * Get fcm token to eventually use from a serve
     */
    getToken(): Promise<any>;
    /**
     * Remove local fcm instance completely
     */
    deleteInstance(): Promise<any>;
}

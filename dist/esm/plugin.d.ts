import { FCMProtocol } from './definitions';
export declare class FCM implements FCMProtocol {
    subscribeTo(options: {
        topic: string;
    }): any;
    unsubscribeFrom(options: {
        topic: string;
    }): any;
    getToken(): any;
    /**
     * only androidy
     */
    deleteInstance(): any;
}

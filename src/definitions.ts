import type { PluginListenerHandle } from '@capacitor/core';

/**
 * Payload emitted when FCM mints or refreshes a registration token.
 */
export type TokenReceivedEvent = {
  /**
   * The current FCM registration token. This is the same value that
   * `FCMPlugin.getToken()` would return immediately after this event fires.
   * Receiving it via the listener avoids the iOS race between APNs
   * registration completing and FCM exchanging the APNs token for an FCM
   * registration token.
   */
  token: string;
};

export interface FCMPlugin {
  /**
   * Subscribe to fcm topic
   * @param options
   */
  subscribeTo(options: { topic: string }): Promise<{ message: string }>;

  /**
   * Unsubscribe from fcm topic
   * @param options
   */
  unsubscribeFrom(options: { topic: string }): Promise<{ message: string }>;

  /**
   * Get fcm token to eventually use from a serve
   *
   * Recommended to use this instead of
   * @usage
   * ```typescript
   * PushNotifications.addListener("registration", (token) => {
   *   console.log(token.data);
   * });
   * ```
   * because the native capacitor method, for apple, returns the APN's token
   */
  getToken(): Promise<{ token: string }>;

  /**
   * Refresh fcm token to eventually use from a serve
   *
   * Recommended to use this instead of
   * @usage
   * ```typescript
   * PushNotifications.addListener("registration", (token) => {
   *   console.log(token.data);
   * });
   * ```
   * because the native capacitor method, for apple, returns the APN's token
   */
  refreshToken(): Promise<{ token: string }>;

  /**
   * Remove local fcm instance completely
   */
  deleteInstance(): Promise<boolean>;

  /**
   * Enabled/disabled auto initialization.
   * @param options
   */
  setAutoInit(options: { enabled: boolean }): Promise<void>;

  /**
   * Retrieve the auto initialization status.
   */
  isAutoInitEnabled(): Promise<{ enabled: boolean }>;

  /**
   * Subscribe to fresh FCM registration tokens.
   *
   * The `tokenReceived` event fires whenever the underlying Firebase
   * Messaging SDK delivers a new or refreshed token to the device.
   *
   * **iOS**: emitted from
   * `MessagingDelegate.messaging(_:didReceiveRegistrationToken:)`. Fires
   * shortly after `PushNotifications.register()` succeeds (once FCM has
   * exchanged the APNs device token for an FCM registration token), and
   * again on any subsequent token rotation (e.g. `refreshToken()`, app
   * reinstall, restored from backup).
   *
   * **Android**: emitted from `FirebaseMessagingService.onNewToken(String)`,
   * forwarded by the bundled `FCMMessagingService` subclass of
   * `@capacitor/push-notifications`' `MessagingService`. Fires on first
   * registration, on `refreshToken()`, and on any FCM-internal token
   * rotation. Tokens minted before the JS listener attaches are buffered
   * by the native plugin and dispatched as soon as the listener registers.
   *
   * **When to use this listener over `getToken()`:**
   * Prefer this event for persisting the token to your backend.
   * `getToken()` can return a stale value on iOS if called immediately after
   * `PushNotifications.register()` because the FCM ↔ APNs exchange has not
   * yet completed. On Android, this event is the only signal for asynchronous
   * token rotations after the initial registration.
   *
   * @example
   * ```ts
   * const handle = await FCM.addListener('tokenReceived', ({ token }) => {
   *   await saveFcmToken(token);
   * });
   * // later: await handle.remove();
   * ```
   */
  addListener(
    eventName: 'tokenReceived',
    listenerFunc: (event: TokenReceivedEvent) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Remove all event listeners registered on this plugin.
   */
  removeAllListeners(): Promise<void>;
}

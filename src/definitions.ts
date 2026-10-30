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

export interface FirebaseOptions {
  /**
   * The Firebase app ID (mobilesdk_app_id on Android, GOOGLE_APP_ID on iOS).
   */
  applicationId: string;
  /**
   * The GCM sender ID (the Firebase project number).
   */
  gcmSenderId: string;
  /**
   * The Firebase API key.
   */
  apiKey: string;
  /**
   * The Firebase project ID.
   */
  projectId: string;
}

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
   * **iOS only.** Emitted from
   * `MessagingDelegate.messaging(_:didReceiveRegistrationToken:)`. This fires
   * shortly after `PushNotifications.register()` succeeds (once FCM has
   * exchanged the APNs device token for an FCM registration token), and
   * again on any subsequent token rotation (e.g. `refreshToken()`, app
   * reinstall, restored from backup).
   *
   * **Android**: this event does not fire. Use the `registration` event from
   * `@capacitor/push-notifications` instead. On Android its `value` is already
   * the FCM token, and it fires again whenever FCM rotates the token:
   *
   * ```ts
   * PushNotifications.addListener('registration', ({ value }) => saveFcmToken(value));
   * ```
   *
   * **When to use this listener over `getToken()`:**
   * Prefer this event for persisting the token to your backend.
   * `getToken()` can return a stale value on iOS if called immediately after
   * `PushNotifications.register()` because the FCM ↔ APNs exchange has not
   * yet completed.
   *
   * @example
   * ```ts
   * const handle = await FCM.addListener('tokenReceived', async ({ token }) => {
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

  /**
   * Initialize Firebase with runtime credentials instead of relying on a
   * static google-services.json / GoogleService-Info.plist. Intended for
   * multi-tenant apps where the correct Firebase project is only known after
   * the user authenticates.
   *
   * All four options are required; the call is rejected if any is missing.
   * Must be called before PushNotifications.register() / getToken().
   *
   * Platform notes:
   * - Android: creates a named secondary FirebaseApp ("FCM") so it does not
   *   conflict with the default app initialized from google-services.json.
   *   Every method of this plugin is routed through it once set. Calling it
   *   again with different options deletes and re-creates that app, so tenants
   *   can be switched at runtime. Keep google-services.json in the app, since
   *   `@capacitor/push-notifications` still uses the default app, and read the
   *   tenant token with `getToken()` rather than its `registration` event.
   * - iOS: configures the default FirebaseApp, which only works when no
   *   GoogleService-Info.plist is shipped. The Firebase iOS SDK cannot
   *   re-configure an app, so switching tenants requires an app restart; a
   *   second call is rejected. Other methods reject until Firebase is configured.
   */
  setFirebaseOptions(options: FirebaseOptions): Promise<void>;
}

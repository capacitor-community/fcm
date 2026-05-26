export interface FirebaseOptions {
  /**
   * The Firebase app ID (mobilesdk_app_id on Android, GOOGLE_APP_ID on iOS).
   */
  applicationId: string;
  /**
   * The GCM sender ID (project_number on Android / iOS).
   * Required on iOS; ignored on Android (deprecated in Firebase Android SDK 29+).
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
   * Initialize Firebase with runtime credentials instead of relying on a
   * static google-services.json / GoogleService-Info.plist. Intended for
   * multi-tenant apps where the correct Firebase project is only known after
   * the user authenticates.
   *
   * Must be called before PushNotifications.register() / getToken().
   *
   * Platform notes:
   * - Android: creates a named secondary FirebaseApp ("FCM") so it does not
   *   conflict with any default app already initialized from google-services.json.
   *   getToken() / refreshToken() are automatically routed through it.
   * - iOS: configures the default FirebaseApp when no GoogleService-Info.plist
   *   is present. Do not ship GoogleService-Info.plist when using this method
   *   on iOS. Re-initialization after first configure is not supported (Firebase
   *   SDK limitation).
   */
  setFirebaseOptions(options: FirebaseOptions): Promise<void>;
}

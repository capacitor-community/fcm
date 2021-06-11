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
}

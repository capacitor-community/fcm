package com.getcapacitor.community.fcm;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.capacitorjs.plugins.pushnotifications.MessagingService;
import com.google.firebase.messaging.FirebaseMessagingService;
import java.lang.reflect.Method;
import org.junit.Test;

/**
 * Maintenance contract tests guarding the @capacitor/push-notifications
 * MessagingService surface that FCMMessagingService extends.
 *
 * If either of these fails, the override in FCMMessagingService is broken
 * silently and tokenReceived would stop firing on Android. Investigate the
 * push-notifications version bump that introduced the regression and either
 * adjust FCMMessagingService or pin the peerDependency.
 */
public class MessagingServiceContractTest {

    @Test
    public void pushNotificationsMessagingServiceExposesOnNewToken() throws NoSuchMethodException {
        Method m = MessagingService.class.getDeclaredMethod("onNewToken", String.class);
        assertNotNull("MessagingService.onNewToken(String) must exist", m);
    }

    @Test
    public void pushNotificationsMessagingServiceExtendsFirebaseMessagingService() {
        assertTrue(
            "MessagingService must extend FirebaseMessagingService for FCM to route MESSAGING_EVENT to FCMMessagingService",
            FirebaseMessagingService.class.isAssignableFrom(MessagingService.class)
        );
    }
}

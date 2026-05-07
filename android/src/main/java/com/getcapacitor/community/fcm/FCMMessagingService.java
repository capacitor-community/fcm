package com.getcapacitor.community.fcm;

import android.util.Log;
import androidx.annotation.NonNull;
import com.capacitorjs.plugins.pushnotifications.MessagingService;

/**
 * Subclass of @capacitor/push-notifications' MessagingService that forwards
 * onNewToken events to FCMPlugin so the JS layer can listen via the
 * `tokenReceived` event.
 *
 * Registered in this plugin's AndroidManifest.xml; the same manifest uses
 * tools:node="remove" to drop PushNotifications' default service entry.
 * Android FCM only routes MESSAGING_EVENT to a single
 * FirebaseMessagingService, so this subclass takes its place.
 *
 * Ordering: super.onNewToken() is invoked first to preserve PushNotifications'
 * existing token handling (its JS-side `registration` event still fires as
 * before). If super throws, we log and continue — `tokenReceived` is the
 * authoritative source for this plugin's JS layer and must not be skipped
 * because of a fault upstream.
 *
 * Maintenance: the @capacitor/push-notifications dependency is declared as a
 * peerDependency. Any rename or removal of MessagingService or its
 * onNewToken(String) method would break this override silently. The
 * MessagingServiceContractTest unit test fails CI if either changes — keep it
 * green when bumping the push-notifications version.
 */
public class FCMMessagingService extends MessagingService {

    private static final String TAG = "FCMMessagingService";

    @Override
    public void onNewToken(@NonNull String token) {
        try {
            super.onNewToken(token);
        } catch (Exception e) {
            Log.w(TAG, "PushNotifications.onNewToken threw an exception", e);
            // Continue — `tokenReceived` is the authoritative source.
        }
        FCMPlugin.onNewTokenReceived(token);
    }
}

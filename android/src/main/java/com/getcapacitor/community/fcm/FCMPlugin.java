package com.getcapacitor.community.fcm;

import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.installations.FirebaseInstallations;
import com.google.firebase.messaging.FirebaseMessaging;

/**
 * Please read the Capacitor Android Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/android
 *
 * Created by Stewan Silva on 1/23/19.
 */
@CapacitorPlugin(name = "FCM")
public class FCMPlugin extends Plugin {

    public static final String TAG = "FirebaseMessaging";

    private static final String SECONDARY_APP_NAME = "FCM";

    private FirebaseApp secondaryApp;

    private FirebaseMessaging getFirebaseMessaging() {
        return secondaryApp != null ? secondaryApp.get(FirebaseMessaging.class) : FirebaseMessaging.getInstance();
    }

    private FirebaseInstallations getFirebaseInstallations() {
        return secondaryApp != null ? FirebaseInstallations.getInstance(secondaryApp) : FirebaseInstallations.getInstance();
    }

    @PluginMethod
    public void subscribeTo(final PluginCall call) {
        final String topicName = call.getString("topic");

        getFirebaseMessaging()
            .subscribeToTopic(topicName)
            .addOnSuccessListener(aVoid -> {
                JSObject ret = new JSObject();
                ret.put("message", "Subscribed to topic " + topicName);
                call.resolve(ret);
            })
            .addOnFailureListener(e -> call.reject("Cant subscribe to topic" + topicName, e));
    }

    @PluginMethod
    public void unsubscribeFrom(final PluginCall call) {
        final String topicName = call.getString("topic");

        getFirebaseMessaging()
            .unsubscribeFromTopic(topicName)
            .addOnSuccessListener(aVoid -> {
                JSObject ret = new JSObject();
                ret.put("message", "Unsubscribed from topic " + topicName);
                call.resolve(ret);
            })
            .addOnFailureListener(e -> call.reject("Cant unsubscribe from topic" + topicName, e));
    }

    @PluginMethod
    public void deleteInstance(final PluginCall call) {
        getFirebaseInstallations()
            .delete()
            .addOnSuccessListener(aVoid -> call.resolve())
            .addOnFailureListener(e -> {
                e.printStackTrace();
                call.reject("Cant delete Firebase Instance ID", e);
            });
    }

    @PluginMethod
    public void getToken(final PluginCall call) {
        getFirebaseMessaging()
            .getToken()
            .addOnCompleteListener(getActivity(), tokenResult -> {
                if (!tokenResult.isSuccessful()) {
                    Exception exception = tokenResult.getException();
                    Log.w(TAG, "Fetching FCM registration token failed", exception);
                    call.errorCallback(exception.getLocalizedMessage());
                    return;
                }
                JSObject data = new JSObject();
                data.put("token", tokenResult.getResult());
                call.resolve(data);
            });

        getFirebaseMessaging().getToken().addOnFailureListener(e -> call.reject("Failed to get FCM registration token", e));
    }

    @PluginMethod
    public void refreshToken(final PluginCall call) {
        getFirebaseMessaging()
            .deleteToken()
            .addOnCompleteListener(result -> {
                getFirebaseMessaging()
                    .getToken()
                    .addOnCompleteListener(getActivity(), tokenResult -> {
                        JSObject data = new JSObject();
                        data.put("token", tokenResult.getResult());
                        call.resolve(data);
                    })
                    .addOnFailureListener(e -> call.reject("Failed to get FCM registration token", e));
            })
            .addOnFailureListener(e -> call.reject("Failed to delete FCM registration token", e));
    }

    @PluginMethod
    public void setAutoInit(final PluginCall call) {
        final boolean enabled = call.getBoolean("enabled", false);
        getFirebaseMessaging().setAutoInitEnabled(enabled);
        call.resolve();
    }

    @PluginMethod
    public void isAutoInitEnabled(final PluginCall call) {
        final boolean enabled = getFirebaseMessaging().isAutoInitEnabled();
        JSObject data = new JSObject();
        data.put("enabled", enabled);
        call.resolve(data);
    }

    @PluginMethod
    public void setFirebaseOptions(final PluginCall call) {
        String applicationId = call.getString("applicationId");
        String gcmSenderId = call.getString("gcmSenderId");
        String apiKey = call.getString("apiKey");
        String projectId = call.getString("projectId");

        if (isEmpty(applicationId) || isEmpty(gcmSenderId) || isEmpty(apiKey) || isEmpty(projectId)) {
            call.reject("applicationId, gcmSenderId, apiKey and projectId are required");
            return;
        }

        FirebaseOptions options = new FirebaseOptions.Builder()
            .setApplicationId(applicationId)
            .setGcmSenderId(gcmSenderId)
            .setApiKey(apiKey)
            .setProjectId(projectId)
            .build();

        try {
            // Use a named secondary app so we don't conflict with the default app
            // that may already exist from google-services.json.
            FirebaseApp existing = null;
            for (FirebaseApp app : FirebaseApp.getApps(getContext())) {
                if (SECONDARY_APP_NAME.equals(app.getName())) {
                    existing = app;
                    break;
                }
            }

            if (existing != null && options.equals(existing.getOptions())) {
                secondaryApp = existing;
            } else {
                // Switching tenants: an existing app's options can't be changed, so tear it down first.
                if (existing != null) {
                    secondaryApp = null;
                    existing.delete();
                }
                secondaryApp = FirebaseApp.initializeApp(getContext(), options, SECONDARY_APP_NAME);
            }
        } catch (Exception e) {
            call.reject("Failed to initialize Firebase with the given options", e);
            return;
        }
        call.resolve();
    }

    private static boolean isEmpty(String value) {
        return value == null || value.isEmpty();
    }
}

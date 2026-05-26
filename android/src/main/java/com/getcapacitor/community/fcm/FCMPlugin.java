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

    private FirebaseApp secondaryApp;
    private FirebaseMessaging secondaryMessaging;

    private FirebaseMessaging getFirebaseMessaging() {
        return secondaryApp != null ? secondaryMessaging : FirebaseMessaging.getInstance();
    }

    @PluginMethod
    public void subscribeTo(final PluginCall call) {
        final String topicName = call.getString("topic");

        FirebaseMessaging.getInstance()
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

        FirebaseMessaging.getInstance()
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
        FirebaseInstallations.getInstance()
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
        String apiKey = call.getString("apiKey");
        String projectId = call.getString("projectId");

        // gcmSenderId is accepted for interface parity with iOS but omitted from
        // FirebaseOptions.Builder — setGcmSenderId() was removed in Firebase Android SDK 29+.
        FirebaseOptions options = new FirebaseOptions.Builder()
            .setApplicationId(applicationId)
            .setApiKey(apiKey)
            .setProjectId(projectId)
            .build();

        // Use a named secondary app ("FCM") so we don't conflict with or
        // re-initialize the default app that may already exist from google-services.json.
        FirebaseApp existing = null;
        for (FirebaseApp app : FirebaseApp.getApps(getContext())) {
            if ("FCM".equals(app.getName())) {
                existing = app;
                break;
            }
        }
        secondaryApp = existing != null
            ? existing
            : FirebaseApp.initializeApp(getContext(), options, "FCM");
        secondaryMessaging = secondaryApp.get(FirebaseMessaging.class);
        call.resolve();
    }
}

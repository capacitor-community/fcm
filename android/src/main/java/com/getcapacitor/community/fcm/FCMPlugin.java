package com.getcapacitor.community.fcm;

import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.firebase.installations.FirebaseInstallations;
import com.google.firebase.messaging.FirebaseMessaging;

/**
 * Please read the Capacitor Android Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/android
 *
 * Created by Stewan Silva on 1/23/19.
 */
@CapacitorPlugin(
        name = "FCM"
)
public class FCMPlugin extends Plugin {

    public static final String TAG = "FirebaseMessaging";

    @PluginMethod()
    public void subscribeTo(final PluginCall call) {
        final String topicName = call.getString("topic");

        FirebaseMessaging
                .getInstance()
                .subscribeToTopic(topicName)
                .addOnSuccessListener(aVoid -> {
                    JSObject ret = new JSObject();
                    ret.put("message", "Subscribed to topic " + topicName);
                    call.resolve(ret);
                })
                .addOnFailureListener(e -> call.reject("Cant subscribe to topic" + topicName, e));

    }

    @PluginMethod()
    public void unsubscribeFrom(final PluginCall call) {
        final String topicName = call.getString("topic");

        FirebaseMessaging
                .getInstance()
                .unsubscribeFromTopic(topicName)
                .addOnSuccessListener(aVoid -> {
                    JSObject ret = new JSObject();
                    ret.put("message", "Unsubscribed from topic " + topicName);
                    call.resolve(ret);
                })
                .addOnFailureListener(e -> call.reject("Cant unsubscribe from topic" + topicName, e));

    }

    @PluginMethod()
    public void deleteInstance(final PluginCall call) {
        FirebaseInstallations.getInstance().delete()
                .addOnSuccessListener(aVoid -> call.resolve())
                .addOnFailureListener(e -> {
                    e.printStackTrace();
                    call.reject("Cant delete Firebase Instance ID", e);
                });
    }

    @PluginMethod()
    public void getToken(final PluginCall call) {
        FirebaseMessaging.getInstance().getToken().addOnCompleteListener(getActivity(), tokenResult -> {
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

        FirebaseMessaging.getInstance().getToken().addOnFailureListener(e -> call.reject("Failed to get FCM registration token", e));
    }
    
    @PluginMethod()
    public void refreshToken(final PluginCall call) {
        FirebaseMessaging.getInstance().deleteToken().addOnCompleteListener((result) -> {
            FirebaseMessaging.getInstance().getToken().addOnCompleteListener(getActivity(), tokenResult -> {
                JSObject data = new JSObject();
                data.put("token", tokenResult.getResult());
                call.resolve(data);
            }).addOnFailureListener(e -> call.reject("Failed to get FCM registration token", e));
        }).addOnFailureListener(e -> call.reject("Failed to delete FCM registration token", e));
    }

    @PluginMethod()
    public void setAutoInit(final PluginCall call) {
        final boolean enabled = call.getBoolean("enabled", false);
        FirebaseMessaging.getInstance().setAutoInitEnabled(enabled);
        call.resolve();
    }

    @PluginMethod()
    public void isAutoInitEnabled(final PluginCall call) {
        final boolean enabled = FirebaseMessaging.getInstance().isAutoInitEnabled();
        JSObject data = new JSObject();
        data.put("enabled", enabled);
        call.resolve(data);
    }
}

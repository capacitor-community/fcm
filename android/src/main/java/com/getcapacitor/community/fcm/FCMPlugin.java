package com.getcapacitor.community.fcm;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.FirebaseMessaging;

import java.io.IOException;

/**
 * Please read the Capacitor Android Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/android
 *
 * Created by Stewan Silva on 1/23/19.
 */
@NativePlugin()
public class FCMPlugin extends Plugin {

    @PluginMethod()
    public void subscribeTo(final PluginCall call) {
        final String topicName = call.getString("topic");

        FirebaseMessaging
                .getInstance()
                .subscribeToTopic(topicName)
                .addOnSuccessListener(aVoid -> {
                    JSObject ret = new JSObject();
                    ret.put("message", "Subscribed to topic " + topicName);
                    call.success(ret);
                })
                .addOnFailureListener(e -> call.error("Cant subscribe to topic" + topicName, e));

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
                    call.success(ret);
                })
                .addOnFailureListener(e -> call.error("Cant unsubscribe from topic" + topicName, e));

    }

    @PluginMethod()
    public void deleteInstance(final PluginCall call) {
        Runnable r = () -> {
            try {
                FirebaseInstanceId.getInstance().deleteInstanceId();
                call.success();
            } catch (IOException e) {
                e.printStackTrace();
                call.error("Cant delete Firebase Instance ID", e);
            }
        };

        // Run in background thread since `deleteInstanceId()` is a blocking request.
        // See https://firebase.google.com/docs/reference/android/com/google/firebase/iid/FirebaseInstanceId#deleteInstanceId()
        new Thread(r).start();
    }

    @PluginMethod()
    public void getToken(final PluginCall call) {
        FirebaseInstanceId.getInstance().getInstanceId().addOnSuccessListener(getActivity(), instanceIdResult -> {
            JSObject data = new JSObject();
            data.put("token", instanceIdResult.getToken());
            call.success(data);
        });
        FirebaseInstanceId.getInstance().getInstanceId().addOnFailureListener(e -> call.error("Failed to get instance FirebaseID", e));
    }

    @PluginMethod()
    public void setAutoInitEnabled(final PluginCall call) {
        final boolean enabled = call.getBoolean("enabled", false);
        FirebaseMessaging.getInstance().setAutoInitEnabled(enabled);
        call.success();
    }

    @PluginMethod()
    public void isAutoInitEnabled(final PluginCall call) {
        final boolean enabled = FirebaseMessaging.getInstance().isAutoInitEnabled();
        JSObject data = new JSObject();
        data.put("enabled", enabled);
        call.success(data);
    }
}

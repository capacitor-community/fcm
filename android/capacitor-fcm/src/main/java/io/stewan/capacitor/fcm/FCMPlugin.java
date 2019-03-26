package io.stewan.capacitor.fcm;

import android.support.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.google.firebase.messaging.FirebaseMessaging;

import java.io.IOException;

@NativePlugin()
public class FCMPlugin extends Plugin {

    @PluginMethod()
    public void subscribeTo(final PluginCall call) {
        final String topicName = call.getString("topic");

        FirebaseMessaging
                .getInstance()
                .subscribeToTopic(topicName)
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        JSObject ret = new JSObject();
                        ret.put("message", "Subscribed to topic " + topicName);
                        call.success(ret);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        call.error("Cant subscribe to topic" + topicName, e);
                    }
                });

    }

    @PluginMethod()
    public void unsubscribeFrom(final PluginCall call) {
        final String topicName = call.getString("topic");

        FirebaseMessaging
                .getInstance()
                .unsubscribeFromTopic(topicName)
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        JSObject ret = new JSObject();
                        ret.put("message", "Unsubscribed from topic " + topicName);
                        call.success(ret);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        call.error("Cant unsubscribe from topic" + topicName, e);
                    }
                });

    }

    @PluginMethod()
    public void deleteInstance(final PluginCall call) {
        try {
            FirebaseInstanceId.getInstance().deleteInstanceId();
            call.success();
        } catch (IOException e) {
            e.printStackTrace();
            call.error("Cant delete Firebase Instance ID", e);
        }
    }

    @PluginMethod()
    public void getToken(final PluginCall call) {
        FirebaseInstanceId.getInstance().getInstanceId()
                .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                    @Override
                    public void onComplete(@NonNull Task<InstanceIdResult> task) {
                        if (!task.isSuccessful()) {
                            call.error("Cant get token", task.getException());
                            return;
                        }

                        String token = task.getResult().getToken();
                        JSObject ret = new JSObject();
                        ret.put("token", token);
                        call.success(ret);
                    }
                });
    }
}

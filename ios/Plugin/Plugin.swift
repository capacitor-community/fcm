import Foundation
import Capacitor
import UserNotifications

import FirebaseCore
import FirebaseMessaging
import FirebaseInstallations

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 *
 * Created by Stewan Silva on 1/23/19.
 */
@objc(FCMPlugin)
public class FCMPlugin: CAPPlugin, MessagingDelegate {
    var fcmToken: String?
    private var lastNotifiedToken: String?

    override public func load() {
        if FirebaseApp.app() == nil {
            FirebaseApp.configure()
        }
        Messaging.messaging().delegate = self
        NotificationCenter.default.addObserver(self, selector: #selector(self.didRegisterWithToken(notification:)), name: .capacitorDidRegisterForRemoteNotifications, object: nil)
    }

    @objc func didRegisterWithToken(notification: NSNotification) {
        guard let deviceToken = notification.object as? Data else {
            return
        }
        Messaging.messaging().apnsToken = deviceToken
    }

    @objc func subscribeTo(_ call: CAPPluginCall) {
        let topicName = call.getString("topic") ?? ""
        Messaging.messaging().subscribe(toTopic: topicName) { error in
            // print("Subscribed to weather topic")
            if (error) != nil {
                print("ERROR while trying to subscribe topic \(topicName)")
                call.reject("Can't subscribe to topic \(topicName)")
            } else {
                call.resolve([
                    "message": "subscribed to topic \(topicName)"
                ])
            }
        }
    }

    @objc func unsubscribeFrom(_ call: CAPPluginCall) {
        let topicName = call.getString("topic") ?? ""
        Messaging.messaging().unsubscribe(fromTopic: topicName) { error in
            if (error) != nil {
                call.reject("Can't unsubscribe from topic \(topicName)")
            } else {
                call.resolve([
                    "message": "unsubscribed from topic \(topicName)"
                ])
            }
        }
    }

    @objc func getToken(_ call: CAPPluginCall) {
        if (fcmToken ?? "").isEmpty {
            Messaging.messaging().token { token, error in
                if let error = error {
                    print("Error fetching FCM registration token: \(error)")
                    call.reject("Failed to get instance FirebaseID", error.localizedDescription)
                } else if let token = token {
                    print("FCM registration token: \(token)")
                    self.fcmToken = token
                    call.resolve([
                        "token": token
                    ])
                }
            }
        } else {
            call.resolve([
                "token": fcmToken
            ])
        }
    }

    @objc func refreshToken(_ call: CAPPluginCall) {
        Messaging.messaging().deleteToken { error in
            if let error = error {
                print("Error deleting FCM token: \(error)")
                call.reject("Failed to delete FCM token", error.localizedDescription)
                return
            }

            Messaging.messaging().token { token, error in
                if let error = error {
                    print("Error fetching FCM registration token: \(error)")
                    call.reject("Failed to get FCM registration token", error.localizedDescription)
                } else if let token = token {
                    print("FCM registration token: \(token)")
                    self.fcmToken = token
                    call.resolve([
                        "token": token
                    ])
                }
            }
        }
    }

    @objc func deleteInstance(_ call: CAPPluginCall) {
        Installations.installations().delete { error in
            if let error = error {
                print("Error deleting installation: \(error)")
                call.reject("Cant delete Firebase Instance ID", error.localizedDescription)
            }
            // reset fcmToken
            self.fcmToken = ""
            call.resolve()
        }
    }

    @objc func setAutoInit(_ call: CAPPluginCall) {
        let enabled: Bool = call.getBool("enabled") ?? false
        Messaging.messaging().isAutoInitEnabled = enabled
        call.resolve()
    }

    @objc func isAutoInitEnabled(_ call: CAPPluginCall) {
        call.resolve([
            "enabled": Messaging.messaging().isAutoInitEnabled
        ])
    }

    @objc public func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        self.fcmToken = fcmToken
        guard let token = fcmToken else { return }

        // Only fire `tokenReceived` for tokens bound to a real APNs device
        // token AND not already delivered. Firebase Messaging mints a
        // "pre-APNs" registration token on first launch before APNs
        // registration completes; emitting that one would persist a stale
        // value in the consumer backend because FCM replaces the token a
        // moment later. The lastNotifiedToken check also dedupes the
        // redeliveries Firebase sometimes emits on foreground or
        // background→foreground transitions.
        guard Messaging.messaging().apnsToken != nil else { return }
        guard token != lastNotifiedToken else { return }
        lastNotifiedToken = token

        notifyListeners("tokenReceived", data: ["token": token])
    }
}

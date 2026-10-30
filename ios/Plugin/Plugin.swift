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
    // APNs token received before Firebase was configured (setFirebaseOptions() path).
    private var pendingApnsToken: Data?

    override public func load() {
        // Only auto-configure from plist when a GoogleService-Info.plist is present.
        // Apps using setFirebaseOptions() for dynamic/multi-tenant config must NOT
        // ship GoogleService-Info.plist — Firebase will be configured at runtime instead.
        if FirebaseApp.app() == nil,
           Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") != nil {
            FirebaseApp.configure()
        }
        // Messaging.messaging() raises when no default app is configured, so the
        // delegate is set here only if the plist path ran; otherwise setFirebaseOptions() sets it.
        if FirebaseApp.app() != nil {
            Messaging.messaging().delegate = self
        }
        NotificationCenter.default.addObserver(self, selector: #selector(self.didRegisterWithToken(notification:)), name: .capacitorDidRegisterForRemoteNotifications, object: nil)
    }

    @objc func didRegisterWithToken(notification: NSNotification) {
        guard let deviceToken = notification.object as? Data else {
            return
        }
        guard FirebaseApp.app() != nil else {
            // Applied once setFirebaseOptions() configures Firebase.
            pendingApnsToken = deviceToken
            return
        }
        Messaging.messaging().apnsToken = deviceToken
    }

    private func ensureFirebaseConfigured(_ call: CAPPluginCall) -> Bool {
        if FirebaseApp.app() != nil {
            return true
        }
        call.reject("Firebase is not configured. Add GoogleService-Info.plist or call setFirebaseOptions() first.")
        return false
    }

    @objc func subscribeTo(_ call: CAPPluginCall) {
        guard ensureFirebaseConfigured(call) else { return }
        let topicName = call.getString("topic") ?? ""
        Messaging.messaging().subscribe(toTopic: topicName) { error in
            // print("Subscribed to weather topic")
            if let error = error {
                print("ERROR while trying to subscribe topic \(topicName)")
                call.reject("Can't subscribe to topic \(topicName): \(error.localizedDescription)", nil, error)
            } else {
                call.resolve([
                    "message": "subscribed to topic \(topicName)"
                ])
            }
        }
    }

    @objc func unsubscribeFrom(_ call: CAPPluginCall) {
        guard ensureFirebaseConfigured(call) else { return }
        let topicName = call.getString("topic") ?? ""
        Messaging.messaging().unsubscribe(fromTopic: topicName) { error in
            if let error = error {
                call.reject("Can't unsubscribe from topic \(topicName): \(error.localizedDescription)", nil, error)
            } else {
                call.resolve([
                    "message": "unsubscribed from topic \(topicName)"
                ])
            }
        }
    }

    @objc func getToken(_ call: CAPPluginCall) {
        guard ensureFirebaseConfigured(call) else { return }
        if (fcmToken ?? "").isEmpty {
            Messaging.messaging().token { token, error in
                if let error = error {
                    print("Error fetching FCM registration token: \(error)")
                    call.reject("Failed to get instance FirebaseID: \(error.localizedDescription)", nil, error)
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
        guard ensureFirebaseConfigured(call) else { return }
        Messaging.messaging().deleteToken { error in
            if let error = error {
                print("Error deleting FCM token: \(error)")
                call.reject("Failed to delete FCM token: \(error.localizedDescription)", nil, error)
                return
            }

            Messaging.messaging().token { token, error in
                if let error = error {
                    print("Error fetching FCM registration token: \(error)")
                    call.reject("Failed to get FCM registration token: \(error.localizedDescription)", nil, error)
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
        guard ensureFirebaseConfigured(call) else { return }
        Installations.installations().delete { error in
            if let error = error {
                print("Error deleting installation: \(error)")
                call.reject("Cant delete Firebase Instance ID: \(error.localizedDescription)", nil, error)
                return
            }
            // reset fcmToken
            self.fcmToken = ""
            call.resolve()
        }
    }

    @objc func setAutoInit(_ call: CAPPluginCall) {
        guard ensureFirebaseConfigured(call) else { return }
        let enabled: Bool = call.getBool("enabled") ?? false
        Messaging.messaging().isAutoInitEnabled = enabled
        call.resolve()
    }

    @objc func isAutoInitEnabled(_ call: CAPPluginCall) {
        guard ensureFirebaseConfigured(call) else { return }
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

    @objc func setFirebaseOptions(_ call: CAPPluginCall) {
        guard let applicationId = call.getString("applicationId"), !applicationId.isEmpty,
              let gcmSenderId = call.getString("gcmSenderId"), !gcmSenderId.isEmpty,
              let apiKey = call.getString("apiKey"), !apiKey.isEmpty,
              let projectId = call.getString("projectId"), !projectId.isEmpty else {
            call.reject("applicationId, gcmSenderId, apiKey and projectId are required")
            return
        }

        // The Firebase iOS SDK cannot re-configure the default app, so this only works
        // when no GoogleService-Info.plist is shipped (load() skips configure() then).
        // Switching tenants requires an app restart.
        guard FirebaseApp.app() == nil else {
            call.reject("Firebase is already configured. setFirebaseOptions() must be called before any Firebase initialization. Do not ship GoogleService-Info.plist when using dynamic configuration.")
            return
        }

        let options = FirebaseOptions(googleAppID: applicationId, gcmSenderID: gcmSenderId)
        options.apiKey = apiKey
        options.projectID = projectId
        FirebaseApp.configure(options: options)

        Messaging.messaging().delegate = self
        if let deviceToken = pendingApnsToken {
            Messaging.messaging().apnsToken = deviceToken
            pendingApnsToken = nil
        }
        call.resolve()
    }
}

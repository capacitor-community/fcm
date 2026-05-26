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

    override public func load() {
        // Only auto-configure from plist when a GoogleService-Info.plist is present.
        // Apps using setFirebaseOptions() for dynamic/multi-tenant config must NOT
        // ship GoogleService-Info.plist — Firebase will be configured at runtime instead.
        if FirebaseApp.app() == nil,
           Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") != nil {
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
        // Delete FCM Token on Firebase
        FirebaseMessaging.Messaging.messaging().deleteData { error in
            guard let error = error else {
                print("Delete FCMToken successful!")
                return
            }
            call.reject("Delete FCMToken failed", error.localizedDescription)
            print("Delete FCMToken failed: \(String(describing: error.localizedDescription))!")
        }

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
    }

    @objc func setFirebaseOptions(_ call: CAPPluginCall) {
        let applicationId = call.getString("applicationId") ?? ""
        let gcmSenderId   = call.getString("gcmSenderId") ?? ""
        let apiKey        = call.getString("apiKey") ?? ""
        let projectId     = call.getString("projectId") ?? ""

        let options = FirebaseOptions(googleAppID: applicationId, gcmSenderID: gcmSenderId)
        options.apiKey    = apiKey
        options.projectID = projectId

        // Configure the default Firebase app with runtime options.
        // This path is taken when no GoogleService-Info.plist is present
        // (load() skips auto-configuration in that case).
        // Re-initialization after FirebaseApp.configure() is not supported by the
        // Firebase iOS SDK; apps that need to switch tenants must restart.
        guard FirebaseApp.app() == nil else {
            call.reject("Firebase is already configured. setFirebaseOptions() must be called before any Firebase initialization. Do not ship GoogleService-Info.plist when using dynamic configuration.")
            return
        }
        FirebaseApp.configure(options: options)
        Messaging.messaging().delegate = self
        call.resolve()
    }
}

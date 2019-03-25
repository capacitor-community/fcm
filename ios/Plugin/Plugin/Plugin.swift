import Foundation
import Capacitor
import UserNotifications

import FirebaseMessaging
import FirebaseCore
import FirebaseAnalytics
import FirebaseInstanceID


/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(FCM)
public class FCM: CAPPlugin, MessagingDelegate {
    
    public override func load() {
        FirebaseApp.configure()
        Messaging.messaging().delegate = self
    }
    
    @objc func subscribeTo(_ call: CAPPluginCall) {
        let topicName = call.getString("topic") ?? ""
        Messaging.messaging().subscribe(toTopic: topicName) { error in
            // print("Subscribed to weather topic")
            if ((error) != nil) {
                print("ERROR while trying to subscribe topic \(topicName)")
                call.error("Can't subscribe to topic \(topicName)")
            }else{
                call.success([
                    "message": "subscribed to topic \(topicName)"
                    ])
            }
        }
    }
    
    @objc func unsubscribeFrom(_ call: CAPPluginCall) {
        let topicName = call.getString("topic") ?? ""
        Messaging.messaging().unsubscribe(fromTopic: topicName) { error in
            if ((error) != nil) {
                call.error("Can't unsubscribe from topic \(topicName)")
            }else{
                call.success([
                    "message": "unsubscribed from topic \(topicName)"
                    ])
            }
        }
    }
    
    @objc func getToken(_ call: CAPPluginCall) {
        InstanceID.instanceID().instanceID { (result, error) in
            if let error = error {
                call.error("Error", error)
            } else if let result = result {
                call.success([
                    "token": result.token
                    ])
            }
        }
    }
}

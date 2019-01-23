import Foundation
import Capacitor
import FirebaseMessaging
import FirebaseCore
import FirebaseAnalytics
import FirebaseInstanceID



/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(FCM)
public class FCM: CAPPlugin {
    
    @objc func subscribeTo(_ call: CAPPluginCall) {
        // [START subscribe_topic]
        let topicName = call.getString("topic") ?? ""
        Messaging.messaging().subscribe(toTopic: topicName) { error in
            print("Subscribed to weather topic")
            if ((error) != nil) {
                print("ERROR while trying to subscribe topic \(topicName)")
                call.error("Can't subscribe to topic \(topicName)")
            }else{
                call.success([
                    "message": "subscribed to topic \(topicName)"
                    ])
            }
        }
        // [END subscribe_topic]
    }
    
    
    // @todo
    @objc func getToken(_ call: CAPPluginCall) {
        //        // [START log_fcm_reg_token]
        //        let token = Messaging.messaging().fcmToken
        //        print("FCM token: \(token ?? "")")
        //        // [END log_fcm_reg_token]
        //
        //
        //                call.success([
        //                    "token": token as Any
        //                ])
        //
        //        // [START log_iid_reg_token]
        //        InstanceID.instanceID().instanceID { (result, error) in
        //            if let error = error {
        //                print("Error fetching remote instance ID: \(error)")
        //            } else if let result = result {
        //                print("Remote instance ID token: \(result.token)")
        //
        //            }
        //        }
        //        // [END log_iid_reg_token]
    }
}

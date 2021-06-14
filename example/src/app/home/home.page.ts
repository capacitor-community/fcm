import { Component, OnInit, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  PushNotifications,
  PushNotificationSchema,
} from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  session: any;

  notifications: PushNotificationSchema[] = [];

  topicName = 'super-awesome-topic';
  remoteToken: string;

  constructor(private platform: Platform, private zone: NgZone) {}

  ngOnInit() {
    PushNotifications.addListener('registration', (data) => {
      // alert(JSON.stringify(data));
      console.log(data);
    });
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('notification ' + JSON.stringify(notification));
        this.zone.run(() => {
          this.notifications.push(notification);
        });
      }
    );
    PushNotifications.requestPermissions().then((response) =>
      PushNotifications.register().then(() => alert(`registered for push`))
    );
  }

  // move to fcm demo
  subscribeTo() {
    PushNotifications.register()
      .then((_) => {
        FCM.subscribeTo({ topic: this.topicName })
          .then((r) => alert(`subscribed to topic ${this.topicName}`))
          .catch((err) => console.log(err));
      })
      .catch((err) => alert(JSON.stringify(err)));
  }

  unsubscribeFrom() {
    FCM.unsubscribeFrom({ topic: this.topicName })
      .then((r) => alert(`unsubscribed from topic ${this.topicName}`))
      .catch((err) => console.log(err));

    if (this.platform.is('android')) {
      FCM.deleteInstance();
    }
  }

  getToken() {
    FCM.getToken()
      .then((result) => {
        this.remoteToken = result.token;
      })
      .catch((err) => console.log(err));
  }
}

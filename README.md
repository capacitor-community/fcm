# capacitor-fcm

Capacitor plugin to enable features from Firebase Cloud Messaging

## API

- subscribeTo
- unsubscribeFrom
- getToken

## Usage

```js
import { FCM } from "capacitor-fcm";
const fcm = new FCM();

import { Plugins } from "@capacitor/core";
const { PushNotifications } = Plugins;

//
// Subscribe to a specific topic
PushNotifications.register()
    .then(_ => {
    fcm
        .subscribeTo({ topic: "test" })
        .then(r => alert(`subscribed to topic`))
        .catch(err => console.log(err));
    })
    .catch(err => alert(JSON.stringify(err)));

//
// Unsubscribe from a specific topic
fcm
    .unsubscribeFrom({ topic: "test" })
    .then(r => alert(`unsubscribed from topic`))
    .catch(err => console.log(err));
}

//
// get remote token
fcm
    .getToken()
    .then(r => alert(`Token ${r.token}`))
    .catch(err => console.log(err));
}
```

## iOS setup

- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `npm install —-save capacitor-fcm`
- `mkdir www && touch www/index.html`
- `npx cap add ios`
- npx cap open ios
- sign your app at xcode (general tab)
- enable remote notification capabilities
- add `GoogleService-Info.plist` to your app in xcode

Then you should be set to go. Run `ionic cap run ios --livereload` to start the server and play it through xcode

> Important Notice: every time you change a native code you may need to clean the cache (Product > Clean build folder) and then run the app again.

## Android setup

(soon)

## Add Google config files

Navigate to the project settings page for your application on Firebase.

Android: Download the google-services.json file and copy it to the android/app/ directory of your capacitor project. You will also need to add the Firebase SDK to your gradle files. More info can be found here: https://firebase.google.com/docs/android/setup#manually_add_firebase

iOS: Download the GoogleService-Info.plist file. In Xcode right-click on the yellow folder named, "App" and select the 'Add files to "App"'. tip: if you drag and drop your file to this location, Xcode may not be able to find it.

That's all folks.

## Don't forget

1. To add the `GoogleService-Info.plist` file using the xcode. It can be placed at root level.
2. To enable `push notifications` capabilities at xcode
3. To enable `remote notifications` as a background mode at xcode

After all of these steps you should be set to go. Try to run your client using `ionic cap run ios`.

That's all folks.

Follow me [@Twitter](https://twitter.com/StewanSilva)

## License

MIT

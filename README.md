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

## Add Google config files

Navigate to the project settings page for your app on Firebase.

### iOS

Download the `GoogleService-Info.plist` file. In Xcode right-click on the yellow folder named "App" and select the `Add files to "App"`.

> Tip: if you drag and drop your file to this location, Xcode may not be able to find it.

### Android

Download the `google-services.json` file and copy it to `android/app/` directory of your capacitor project.

## iOS setup

- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `npm install —-save capacitor-fcm`
- `mkdir www && touch www/index.html`
- `npx cap add ios`
- `npx cap open ios`
- sign your app at xcode (general tab)
- enable remote notification capabilities
- add `GoogleService-Info.plist` to your app in xcode

> Important Notice: every time you change a native code you may need to clean the cache (Product > Clean build folder) and then run the app again.

## Android setup

(soon)

Now you should be set to go. Try to run your client using `ionic cap run ios --livereload`.

Cheers 🍻

Follow me [@Twitter](https://twitter.com/StewanSilva)

## License

MIT

# capacitor-fcm [![npm version](https://badge.fury.io/js/capacitor-fcm.svg)](https://badge.fury.io/js/capacitor-fcm)

Capacitor plugin to enable features from Firebase Cloud Messaging

> ### Notice
>
> This plugin is intended to be used together with the capacitor api for [Push Notifications](https://capacitor.ionicframework.com/docs/apis/push-notifications).

## API

- subscribeTo
- unsubscribeFrom
- getToken
- deleteInstance `android only`

## Usage

```js
import { Plugins } from "@capacitor/core";
const { FCMPlugin, PushNotifications } = Plugins;

//
// Subscribe to a specific topic
PushNotifications.register()
    .then(_ => {
    FCMPlugin
        .subscribeTo({ topic: "test" })
        .then(r => alert(`subscribed to topic`))
        .catch(err => console.log(err));
    })
    .catch(err => alert(JSON.stringify(err)));

//
// Unsubscribe from a specific topic
FCMPlugin
    .unsubscribeFrom({ topic: "test" })
    .then(r => alert(`unsubscribed from topic`))
    .catch(err => console.log(err));
}

//
// get remote token
FCMPlugin
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
- `npm install --save capacitor-fcm`
- `mkdir www && touch www/index.html`
- `sudo gem install cocoapods`
- `npx cap add ios`
- `npx cap sync ios`
- `npx cap open ios`
- sign your app at xcode (general tab)
- enable remote notification capabilities
- add `GoogleService-Info.plist` to the app folder in xcode
- turn `swizzling` off on app's `info.plist`

```
<key>FirebaseAppDelegateProxyEnabled</key>
<false/>
```

> Tip: every time you change a native code you may need to clean up the cache (Product > Clean build folder) and then run the app again.

## Android setup

- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `npm install --save capacitor-fcm`
- `mkdir www && touch www/index.html`
- `npx cap add android`
- `npx cap sync android`
- `npx cap open android`
- add `google-services.json` to your `android/app` folder
- `[extra step]` in android case we need to tell Capacitor to initialise the plugin:

> on your `MainActivity.java` file add `import io.stewan.capacitor.fcm.FCMPlugin;` and then inside the init callback `add(FCMPlugin.class);`

Now you should be set to go. Try to run your client using `ionic cap run android --livereload`.

> Tip: every time you change a native code you may need to clean up the cache (Build > Clean Project | Build > Rebuild Project) and then run the app again.

## Sample app

https://github.com/stewwan/capacitor-fcm-demo

## You may also like

- [capacitor-analytics](https://github.com/stewwan/capacitor-analytics)
- [capacitor-media](https://github.com/stewwan/capacitor-media)
- [capacitor-intercom](https://github.com/stewwan/capacitor-intercom)
- [capacitor-twitter](https://github.com/stewwan/capacitor-twitter)

Cheers 🍻

Follow me [@Twitter](https://twitter.com/StewanSilva)

## License

MIT

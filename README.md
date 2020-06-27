# capacitor-fcm [![npm version](https://badge.fury.io/js/capacitor-fcm.svg)](https://badge.fury.io/js/capacitor-fcm)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Capacitor plugin to enable features from Firebase Cloud Messaging

> ### Notice
>
> This plugin is intended to be used combined with Capacitor API for [Push Notifications](https://capacitor.ionicframework.com/docs/apis/push-notifications). Capacitor only provides APN token whereas this plugin offers the possibility to work with FCM tokens and more.

## API

| method            | info                                          | platform    |
| ----------------- | --------------------------------------------- | ----------- |
| `subscribeTo`     | subscribe to fcm topic                        | ios/android |
| `unsubscribeFrom` | unsubscribe from fcm topic                    | ios/android |
| `getToken`        | get fcm token to eventually use from a server | ios/android |
| `deleteInstance`  | remove local fcm instance completely          | ios/android |

## Usage

```ts
import { Plugins } from "@capacitor/core";
const { PushNotifications } = Plugins;

//
// with type support
import { FCM } from "capacitor-fcm";
const fcm = new FCM();

//
// alternatively - without types
const { FCMPlugin } = Plugins;

//
// external required step
// register for push
PushNotifications.register()
  .then(() => {
    //
    // Subscribe to a specific topic
    // you can use `FCMPlugin` or just `fcm`
    fcm
      .subscribeTo({ topic: "test" })
      .then((r) => alert(`subscribed to topic`))
      .catch((err) => console.log(err));
  })
  .catch((err) => alert(JSON.stringify(err)));

//
// Unsubscribe from a specific topic
fcm
  .unsubscribeFrom({ topic: "test" })
  .then(() => alert(`unsubscribed from topic`))
  .catch((err) => console.log(err));

//
// Get FCM token instead the APN one returned by Capacitor
fcm
  .getToken()
  .then((r) => alert(`Token ${r.token}`))
  .catch((err) => console.log(err));

//
// Remove FCM instance
fcm
  .deleteInstance()
  .then(() => alert(`Token deleted`))
  .catch((err) => console.log(err));
```

## Add Google config files

Navigate to the project settings page for your app on Firebase.

### iOS

Download the `GoogleService-Info.plist` file. In Xcode right-click on the yellow folder named "App" and select the `Add files to "App"`.

> Tip: if you drag and drop your file to this location, Xcode may not be able to find it.

### Android

Download the `google-services.json` file and copy it to `android/app/` directory of your capacitor project.

### Certificate

- apple
  - create an app identifier (apple site)
    - add push notifications
    - add signing request (https://help.apple.com/developer-account/#/devbfa00fef7)
    - generate an APN key and then note down the ID displayed. also download the p8 file (https://fluffy.es/p8-push-notification/)
- firebase
  - add the downloaded p8 file to firebase settings with noted key ID and the account team ID

## iOS setup

- `sudo gem install cocoapods` _(once a time)_
- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `mkdir www && touch www/index.html`
- `npx cap add ios`
- `npm install --save capacitor-fcm`
- `npx cap sync ios` _(always do sync after a plugin install)_
- `npx cap open ios`

* sign your app at xcode (general tab)
* enable remote notification capabilities
* add `GoogleService-Info.plist` to the app folder in xcode

```
// (optional) turn off `swizzling` in the `info.plist`
<key>FirebaseAppDelegateProxyEnabled</key>
<false/>
```

> Tip: every time you change a native code you may need to clean up the cache (Product > Clean build folder) and then run the app again.

## Android setup

- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `mkdir www && touch www/index.html`
- `npx cap add android`
- `npm install --save capacitor-fcm`
- `npx cap sync android` _(always do sync after a plugin install)_
- `npx cap open android`
- add `google-services.json` to your `android/app` folder
- `[extra step]` in android case we need to tell Capacitor to initialise the plugin:

> on your `MainActivity.java` file add `import io.stewan.capacitor.fcm.FCMPlugin;` and then inside the init callback `add(FCMPlugin.class);`

Now you should be set to go. Try to run your client using `ionic cap run android --livereload`.

> Tip: every time you change a native code you may need to clean up the cache (Build > Clean Project | Build > Rebuild Project) and then run the app again.

## Sample app

https://github.com/capacitor-community/fcm-demo

## You may also like

- [capacitor-analytics](https://github.com/stewwan/capacitor-analytics)
- [capacitor-crashlytics](https://github.com/stewwan/capacitor-crashlytics)
- [capacitor-intercom](https://github.com/stewwan/capacitor-intercom)
- [capacitor-twitter](https://github.com/stewwan/capacitor-twitter)

Cheers 🍻

Follow me [@Twitter](https://twitter.com/StewanSilva)

## License

MIT

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/StewanSilva"><img src="https://avatars1.githubusercontent.com/u/719763?v=4" width="75px;" alt=""/><br /><sub><b>Stew</b></sub></a><br /><a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=stewwan" title="Code">💻</a> <a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=stewwan" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/danielprrazevedo"><img src="https://avatars2.githubusercontent.com/u/20153661?v=4" width="75px;" alt=""/><br /><sub><b>Daniel Pereira</b></sub></a><br /><a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=danielprrazevedo" title="Code">💻</a> <a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=danielprrazevedo" title="Documentation">📖</a></td>
    <td align="center"><a href="http://priyankpatel.io/"><img src="https://avatars3.githubusercontent.com/u/5585797?v=4" width="75px;" alt=""/><br /><sub><b>Priyank Patel</b></sub></a><br /><a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=priyankpat" title="Code">💻</a></td>
    <td align="center"><a href="http://fuubar.wordpress.com/"><img src="https://avatars1.githubusercontent.com/u/1230033?v=4" width="75px;" alt=""/><br /><sub><b>Nikolas</b></sub></a><br /><a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=nikoskip" title="Code">💻</a></td>
    <td align="center"><a href="https://lights0123.com/"><img src="https://avatars3.githubusercontent.com/u/3756309?v=4" width="75px;" alt=""/><br /><sub><b>Ben Schattinger</b></sub></a><br /><a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=lights0123" title="Code">💻</a></td>
    <td align="center"><a href="https://binary.com.au/"><img src="https://avatars2.githubusercontent.com/u/175909?v=4" width="75px;" alt=""/><br /><sub><b>James Manners</b></sub></a><br /><a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=jmannau" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/borodiliz"><img src="https://avatars3.githubusercontent.com/u/2467193?v=4" width="75px;" alt=""/><br /><sub><b>Borja Rodríguez</b></sub></a><br /><a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=borodiliz" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Karrlllis"><img src="https://avatars1.githubusercontent.com/u/37330643?v=4" width="75px;" alt=""/><br /><sub><b>Karrlllis</b></sub></a><br /><a href="https://github.com/stewwan/@capacitor-community/fcm/commits?author=Karrlllis" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
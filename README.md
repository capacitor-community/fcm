<p align="center"><br><img src="https://user-images.githubusercontent.com/236501/85893648-1c92e880-b7a8-11ea-926d-95355b8175c7.png" width="128" height="128" /></p>
<h3 align="center">Capacitor FCM</h3>
<p align="center"><strong><code>@capacitor-community/fcm</code></strong></p>
<p align="center">
  Capacitor community plugin for enabling FCM capabilities
</p>

<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2025?style=flat-square" />
  <a href="https://www.npmjs.com/package/@capacitor-community/fcm"><img src="https://img.shields.io/npm/l/@capacitor-community/fcm?style=flat-square" /></a>
<br>
  <a href="https://www.npmjs.com/package/@capacitor-community/fcm"><img src="https://img.shields.io/npm/dw/@capacitor-community/fcm?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@capacitor-community/fcm"><img src="https://img.shields.io/npm/v/@capacitor-community/fcm?style=flat-square" /></a>
  <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors"><img src="https://img.shields.io/badge/all%20contributors-28-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->

</p>

## Maintainers

| Maintainer   | GitHub                                  | Social                                    |
| ------------ | --------------------------------------- | ----------------------------------------- |
| Stewan Silva | [stewones](https://github.com/stewones) | [@stewones](https://x.com/stewones) |

## Notice 🚀

We're starting fresh under an official org. If you were using the previous npm package `capacitor-fcm`, please update your package.json to `@capacitor-community/fcm`. Check out [changelog](/CHANGELOG.md) for more info.

## Installation

Using npm:

```bash
npm install @capacitor-community/fcm
```

Using yarn:

```bash
yarn add @capacitor-community/fcm
```

Sync native files:

```bash
npx cap sync
```

> ### Notice
>
> This plugin is intended to be used combined with Capacitor API for [Push Notifications](https://capacitor.ionicframework.com/docs/apis/push-notifications). Capacitor only provides APN token whereas this plugin offers the possibility to work with FCM tokens and more.

## API

| method              | info                                          | platform    |
| ------------------- | --------------------------------------------- | ----------- |
| `subscribeTo`       | subscribe to fcm topic                        | ios/android |
| `unsubscribeFrom`   | unsubscribe from fcm topic                    | ios/android |
| `getToken`          | get fcm token to eventually use from a server | ios/android |
| `refreshToken`      | refresh fcm token to get a new one            | ios/android |
| `deleteInstance`    | remove local fcm instance completely          | ios/android |
| `setAutoInit`       | enable the auto initialization of the library | ios/android |
| `isAutoInitEnabled` | check whether auto initialization is enabled  | ios/android |

## Usage

```ts
import { FCM } from '@capacitor-community/fcm';
import { PushNotifications } from '@capacitor/push-notifications';

// external required step
// register for push
await PushNotifications.requestPermissions();
await PushNotifications.register();

// now you can subscribe to a specific topic
FCM.subscribeTo({ topic: 'test' })
  .then(r => alert(`subscribed to topic`))
  .catch(err => console.log(err));

// Unsubscribe from a specific topic
FCM.unsubscribeFrom({ topic: 'test' })
  .then(() => alert(`unsubscribed from topic`))
  .catch(err => console.log(err));

// Get FCM token instead of the APN one returned by Capacitor
FCM.getToken()
  .then(r => alert(`Token ${r.token}`))
  .catch(err => console.log(err));

// Delete the old FCM token and get a new one
FCM.refreshToken()
  .then(r => alert(`Token ${r.token}`))
  .catch(err => console.log(err));

// Remove FCM instance
FCM.deleteInstance()
  .then(() => alert(`Token deleted`))
  .catch(err => console.log(err));

// Enable the auto initialization of the library
FCM.setAutoInit({ enabled: true }).then(() => alert(`Auto init enabled`));

// Check the auto initialization status
FCM.isAutoInitEnabled().then(r => {
  console.log('Auto init is ' + (r.enabled ? 'enabled' : 'disabled'));
});
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
    - add signing request (https://developer.apple.com/help/account/certificates/create-a-certificate-signing-request)
    - generate an APN key and then note down the ID displayed. also download the p8 file (https://fluffy.es/p8-push-notification/)
- firebase
  - add the downloaded p8 file to firebase settings with noted key ID and the account team ID

## iOS setup

- [Install homebrew](https://capacitorjs.com/docs/getting-started/environment-setup#homebrew) _(once)_
- `brew install cocoapods` _(once a time)_
- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `mkdir www && touch www/index.html`
- `npx cap add ios`
- `npm install --save @capacitor-community/fcm`
- `npx cap sync ios` _(always do sync after a plugin install)_
- `npx cap open ios`

* sign your app at xcode (general tab)
* enable remote notification capabilities
* add `GoogleService-Info.plist` to the app folder in xcode

```
// (optional) turn off `swizzling` in the `info.plist`
<key>FirebaseAppDelegateProxyEnabled</key>
<string>NO</string>
```

> Tip: every time you change a native code you may need to clean up the cache (Product > Clean build folder) and then run the app again.

### Prevent auto initialization

If you need to implement opt-in behavior, you can disable the auto initialization of the library by following the [Firebase docs](https://firebase.google.com/docs/cloud-messaging/ios/client#prevent_auto_initialization).

### SPM setup (iOS 15.0+)

__First ensure all your dependencies are compatible with SPM. Otherwise, stick to the Cocoapods installation steps.__

You can also install the plugin using Swift Package Manager (SPM) instead of CocoaPods.
To do so, you don't need to install CocoaPods (steps 1 & 2), but you'll need to configure capacitor to use SPM:
* to add iOS target: `npx cap add ios --packagemanager SPM`
* to migrate an existing target: `npx cap spm-migration-assistant` (with capacitor 7.4.0+).

You can find more info in the official [capacitor docs](https://capacitorjs.com/docs/ios/spm).

## Android setup

- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `mkdir www && touch www/index.html`
- `npx cap add android`
- `npm install --save @capacitor-community/fcm`
- `npx cap sync android` _(always do sync after a plugin install)_
- `npx cap open android`
- add `google-services.json` to your `android/app` folder

Now you should be set to go. Try to run your client using `ionic cap run android --livereload`.

> Tip: every time you change a native code you may need to clean up the cache (Build > Clean Project | Build > Rebuild Project) and then run the app again.

### Variables

This plugin will use the following project variables (defined in your app's `variables.gradle` file):

- `$firebaseMessagingVersion` version of `com.google.firebase:firebase-messaging` (default: `23.1.2`)

### Prevent auto initialization

If you need to implement opt-in behavior, you can disable the auto initialization of the library by following the [Firebase docs](https://firebase.google.com/docs/cloud-messaging/android/client#prevent-auto-init).

## Example

- https://github.com/capacitor-community/fcm/tree/master/example

## License

MIT

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="20%"><a href="https://twitter.com/stewones"><img src="https://avatars1.githubusercontent.com/u/719763?v=4?s=75" width="75px;" alt="stewones"/><br /><sub><b>stewones</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=stewones" title="Code">💻</a> <a href="https://github.com/capacitor-community/fcm/commits?author=stewones" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/danielprrazevedo"><img src="https://avatars2.githubusercontent.com/u/20153661?v=4?s=75" width="75px;" alt="Daniel Pereira"/><br /><sub><b>Daniel Pereira</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=danielprrazevedo" title="Code">💻</a> <a href="https://github.com/capacitor-community/fcm/commits?author=danielprrazevedo" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="20%"><a href="http://priyankpatel.io/"><img src="https://avatars3.githubusercontent.com/u/5585797?v=4?s=75" width="75px;" alt="Priyank Patel"/><br /><sub><b>Priyank Patel</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=priyankpat" title="Code">💻</a></td>
      <td align="center" valign="top" width="20%"><a href="http://fuubar.wordpress.com/"><img src="https://avatars1.githubusercontent.com/u/1230033?v=4?s=75" width="75px;" alt="Nikolas"/><br /><sub><b>Nikolas</b></sub></a><br /><a href="#maintenance-nikoskip" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://lights0123.com/"><img src="https://avatars3.githubusercontent.com/u/3756309?v=4?s=75" width="75px;" alt="Ben Schattinger"/><br /><sub><b>Ben Schattinger</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=lights0123" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="20%"><a href="https://binary.com.au/"><img src="https://avatars2.githubusercontent.com/u/175909?v=4?s=75" width="75px;" alt="James Manners"/><br /><sub><b>James Manners</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=jmannau" title="Code">💻</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/borodiliz"><img src="https://avatars3.githubusercontent.com/u/2467193?v=4?s=75" width="75px;" alt="Borja Rodríguez"/><br /><sub><b>Borja Rodríguez</b></sub></a><br /><a href="#maintenance-borodiliz" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/Karrlllis"><img src="https://avatars1.githubusercontent.com/u/37330643?v=4?s=75" width="75px;" alt="Karrlllis"/><br /><sub><b>Karrlllis</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=Karrlllis" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/jamesmah"><img src="https://avatars0.githubusercontent.com/u/21981049?v=4?s=75" width="75px;" alt="jamesmah"/><br /><sub><b>jamesmah</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=jamesmah" title="Code">💻</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/josh-m-sharpe"><img src="https://avatars3.githubusercontent.com/u/39473?v=4?s=75" width="75px;" alt="Josh Sharpe"/><br /><sub><b>Josh Sharpe</b></sub></a><br /><a href="#maintenance-josh-m-sharpe" title="Maintenance">🚧</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="20%"><a href="https://github.com/msimkunas"><img src="https://avatars.githubusercontent.com/u/9675250?v=4?s=75" width="75px;" alt="Mantas Šimkūnas"/><br /><sub><b>Mantas Šimkūnas</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=msimkunas" title="Code">💻</a> <a href="https://github.com/capacitor-community/fcm/commits?author=msimkunas" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/iOlivier"><img src="https://avatars.githubusercontent.com/u/12254953?v=4?s=75" width="75px;" alt="Olivier Overstraete"/><br /><sub><b>Olivier Overstraete</b></sub></a><br /><a href="#maintenance-iOlivier" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://hemang.dev/"><img src="https://avatars.githubusercontent.com/u/13018570?v=4?s=75" width="75px;" alt="Hemang Kumar"/><br /><sub><b>Hemang Kumar</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=hemangsk" title="Code">💻</a> <a href="#maintenance-hemangsk" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/mesqueeb"><img src="https://avatars.githubusercontent.com/u/3253920?v=4?s=75" width="75px;" alt="Luca Ban"/><br /><sub><b>Luca Ban</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=mesqueeb" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="20%"><a href="https://www.alexgriffith.me/"><img src="https://avatars.githubusercontent.com/u/5904472?v=4?s=75" width="75px;" alt="Alex Griffith"/><br /><sub><b>Alex Griffith</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=halomademeapc" title="Code">💻</a> <a href="#maintenance-halomademeapc" title="Maintenance">🚧</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="20%"><a href="https://github.com/bdirito"><img src="https://avatars.githubusercontent.com/u/8117238?v=4?s=75" width="75px;" alt="bdirito"/><br /><sub><b>bdirito</b></sub></a><br /><a href="#maintenance-bdirito" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/mineminemine"><img src="https://avatars.githubusercontent.com/u/17585549?v=4?s=75" width="75px;" alt="Ryan"/><br /><sub><b>Ryan</b></sub></a><br /><a href="#maintenance-mineminemine" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/josuelmm"><img src="https://avatars.githubusercontent.com/u/12968781?v=4?s=75" width="75px;" alt="Josué Moreno"/><br /><sub><b>Josué Moreno</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=josuelmm" title="Code">💻</a></td>
      <td align="center" valign="top" width="20%"><a href="https://marcjulian.de/?ref=github"><img src="https://avatars.githubusercontent.com/u/8985933?v=4?s=75" width="75px;" alt="Marc"/><br /><sub><b>Marc</b></sub></a><br /><a href="#maintenance-marcjulian" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://floriangyger.ch/"><img src="https://avatars.githubusercontent.com/u/1215256?v=4?s=75" width="75px;" alt="Florian Gyger"/><br /><sub><b>Florian Gyger</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=flogy" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="20%"><a href="http://www.jcesarmobile.com/"><img src="https://avatars.githubusercontent.com/u/1637892?v=4?s=75" width="75px;" alt="jcesarmobile"/><br /><sub><b>jcesarmobile</b></sub></a><br /><a href="#question-jcesarmobile" title="Answering Questions">💬</a> <a href="https://github.com/capacitor-community/fcm/commits?author=jcesarmobile" title="Documentation">📖</a> <a href="#maintenance-jcesarmobile" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/ramikhafagi96"><img src="https://avatars.githubusercontent.com/u/38646828?v=4?s=75" width="75px;" alt="Rami Khafagi"/><br /><sub><b>Rami Khafagi</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=ramikhafagi96" title="Code">💻</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/bipoza"><img src="https://avatars.githubusercontent.com/u/26112509?v=4?s=75" width="75px;" alt="Bittor Poza"/><br /><sub><b>Bittor Poza</b></sub></a><br /><a href="https://github.com/capacitor-community/fcm/commits?author=bipoza" title="Code">💻</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/Vishal-Isharani"><img src="https://avatars.githubusercontent.com/u/10386581?v=4?s=75" width="75px;" alt="Vishal Isharani"/><br /><sub><b>Vishal Isharani</b></sub></a><br /><a href="#maintenance-Vishal-Isharani" title="Maintenance">🚧</a> <a href="https://github.com/capacitor-community/fcm/commits?author=Vishal-Isharani" title="Code">💻</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/kashz"><img src="https://avatars.githubusercontent.com/u/12661101?v=4?s=75" width="75px;" alt="Shunta KARASAWA"/><br /><sub><b>Shunta KARASAWA</b></sub></a><br /><a href="#maintenance-kashz" title="Maintenance">🚧</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="20%"><a href="http://www.chrisweight.com/"><img src="https://avatars.githubusercontent.com/u/468638?v=4?s=75" width="75px;" alt="Chris Weight"/><br /><sub><b>Chris Weight</b></sub></a><br /><a href="#maintenance-chrisweight" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://by.vincent.mahn.ke/"><img src="https://avatars.githubusercontent.com/u/1689033?v=4?s=75" width="75px;" alt="Vincent Mahnke"/><br /><sub><b>Vincent Mahnke</b></sub></a><br /><a href="#maintenance-ViMaSter" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/tompidom"><img src="https://avatars.githubusercontent.com/u/47992794?v=4?s=75" width="75px;" alt="tompidom"/><br /><sub><b>tompidom</b></sub></a><br /><a href="#infra-tompidom" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

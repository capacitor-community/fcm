# FCM example

A small React app for trying every method of `@capacitor-community/fcm` on a device: registration, getting and refreshing the token, topics, auto init, and the iOS `tokenReceived` event.

It installs the plugin from the parent folder (`file:..`), so changes to the plugin show up after a rebuild.

## Requirements

- Node 22+
- Xcode 26+ for iOS, Android Studio for Android
- A Firebase project with an iOS app and an Android app using the bundle/application id `io.capacitor.community.fcm.example` (or change `appId` in `capacitor.config.ts` and the native projects)

## Setup

```bash
# build the plugin
cd ..
npm install
npm run build

# install and sync the example
cd example
npm install
npm run sync
```

### Android

1. Download `google-services.json` from the Firebase console.
2. Put it in `android/app/`.
3. `npx cap run android`

### iOS

1. Download `GoogleService-Info.plist` from the Firebase console.
2. Open `ios/App/App.xcodeproj` and drag the file into the `App` group, with the `App` target checked. The app crashes on launch without it.
3. Pick your team under Signing & Capabilities. The Push Notifications capability is already set up in `App/App.entitlements`.
4. Upload your APNs key in the Firebase console (Project settings > Cloud Messaging).
5. Run on a real device. Simulators can't register for remote notifications.

## Using the app

1. Tap **Request permission and register**. On iOS, topic calls and `getToken` fail until this finishes.
2. Tap **Get token** and copy the token.
3. Send a test message from the Firebase console (Messaging > New campaign > Send test message), or send to the topic you subscribed to.

Everything the plugin returns, and every notification received, shows up in the log at the bottom.

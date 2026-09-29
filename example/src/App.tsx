import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';

type LogEntry = { time: string; text: string };

const errorText = (err: unknown) => (err instanceof Error ? err.message : JSON.stringify(err));

export default function App() {
  const [registered, setRegistered] = useState(false);
  const [token, setToken] = useState('');
  const [topic, setTopic] = useState('news');
  const [autoInit, setAutoInit] = useState<boolean | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);

  const write = (text: string) =>
    setLog((entries) => [{ time: new Date().toLocaleTimeString(), text }, ...entries].slice(0, 50));

  // Runs an FCM call, logging the result or the error.
  const run = async (label: string, fn: () => Promise<unknown>) => {
    try {
      const result = await fn();
      write(`${label}: ${result === undefined ? 'ok' : JSON.stringify(result)}`);
    } catch (err) {
      write(`${label} failed: ${errorText(err)}`);
    }
  };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handles = [
      // On Android `value` is already the FCM token. On iOS it is the APNs token,
      // so use FCM.getToken() or the tokenReceived event below instead.
      PushNotifications.addListener('registration', ({ value }) => {
        setRegistered(true);
        write(`registration (${Capacitor.getPlatform()}): ${value}`);
        if (Capacitor.getPlatform() === 'android') setToken(value);
      }),
      PushNotifications.addListener('registrationError', (err) => write(`registrationError: ${err.error}`)),
      PushNotifications.addListener('pushNotificationReceived', (n) => write(`received: ${JSON.stringify(n)}`)),
      PushNotifications.addListener('pushNotificationActionPerformed', (a) =>
        write(`tapped: ${JSON.stringify(a.notification)}`),
      ),
      // iOS only: fires when FCM issues or rotates the token.
      FCM.addListener('tokenReceived', ({ token }) => {
        write(`tokenReceived: ${token}`);
        setToken(token);
      }),
    ];

    FCM.isAutoInitEnabled().then(({ enabled }) => setAutoInit(enabled));

    return () => {
      handles.forEach((h) => h.then((handle) => handle.remove()));
    };
  }, []);

  const register = () =>
    run('register', async () => {
      const { receive } = await PushNotifications.requestPermissions();
      if (receive !== 'granted') throw new Error(`permission ${receive}`);
      await PushNotifications.register();
    });

  const getToken = () =>
    run('getToken', async () => {
      const result = await FCM.getToken();
      setToken(result.token);
      return result;
    });

  const refreshToken = () =>
    run('refreshToken', async () => {
      const result = await FCM.refreshToken();
      setToken(result.token);
      return result;
    });

  const toggleAutoInit = () =>
    run('setAutoInit', async () => {
      const enabled = !autoInit;
      await FCM.setAutoInit({ enabled });
      setAutoInit(enabled);
      return { enabled };
    });

  if (!Capacitor.isNativePlatform()) {
    return (
      <main>
        <h1>FCM example</h1>
        <p className="note">
          This plugin only works on iOS and Android. Run <code>npx cap run ios</code> or{' '}
          <code>npx cap run android</code>.
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>FCM example</h1>

      <section>
        <h2>1. Register</h2>
        <p className="note">
          Register first. On iOS, topic calls and <code>getToken</code> fail until APNs registration finishes.
        </p>
        <button onClick={register}>{registered ? 'Registered' : 'Request permission and register'}</button>
      </section>

      <section>
        <h2>2. Token</h2>
        <div className="row">
          <button onClick={getToken} disabled={!registered}>
            Get token
          </button>
          <button onClick={refreshToken} disabled={!registered}>
            Refresh token
          </button>
          <button onClick={() => run('deleteInstance', () => FCM.deleteInstance())}>Delete instance</button>
        </div>
        <textarea readOnly value={token} placeholder="FCM token appears here" rows={4} />
      </section>

      <section>
        <h2>3. Topics</h2>
        <div className="row">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic" />
          <button onClick={() => run('subscribeTo', () => FCM.subscribeTo({ topic }))} disabled={!registered || !topic}>
            Subscribe
          </button>
          <button
            onClick={() => run('unsubscribeFrom', () => FCM.unsubscribeFrom({ topic }))}
            disabled={!registered || !topic}
          >
            Unsubscribe
          </button>
        </div>
      </section>

      <section>
        <h2>4. Auto init</h2>
        <button onClick={toggleAutoInit} disabled={autoInit === null}>
          Auto init is {autoInit === null ? '...' : autoInit ? 'on' : 'off'}. Tap to toggle
        </button>
      </section>

      <section>
        <h2>Log</h2>
        <ul className="log">
          {log.map((entry, i) => (
            <li key={i}>
              <time>{entry.time}</time> {entry.text}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

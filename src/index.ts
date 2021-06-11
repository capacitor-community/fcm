import { registerPlugin } from "@capacitor/core";
import { FCMPlugin } from "./definitions";

const FCM = registerPlugin<FCMPlugin>(
    "FCM",
    {
        web: () => import("./web").then((m) => new m.FCMWeb()),
    }
);

// export * from './web'; // @todo
export * from "./definitions";
export { FCM };

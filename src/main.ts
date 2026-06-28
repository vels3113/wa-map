/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.info('Party event script started');

WA.onInit().then(() => {
    console.info('Scripting API ready');

    WA.ui.displayActionMessage({
        message: "Welcome to the party event! Press SPACE to interact with areas.",
        callback: () => {},
        type: "message",
    });

    bootstrapExtra().then(() => {
        console.info('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};

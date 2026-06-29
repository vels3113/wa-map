/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import tutorialPopupHtml from "./tutorial-popup.html?raw";

console.info('Party event script started');

WA.onInit().then(() => {
    console.info('Scripting API ready');

    WA.ui.openPopup("tutorialAnchor", tutorialPopupHtml, [
        {
            label: "Понятно!",
            className: "primary",
            callback: (p) => p.close(),
        },
    ]);

    bootstrapExtra().then(() => {
        console.info('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};

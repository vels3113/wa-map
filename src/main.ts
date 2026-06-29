/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.info('Party event script started');

WA.onInit().then(async () => {
    console.info('Scripting API ready');

    const sessionId = Math.random().toString(36).slice(2);
    const closeEvent = `closeTutorial_${sessionId}`;
    const tutorialUrl = new URL('../tutorial.html', import.meta.url);
    tutorialUrl.searchParams.set('closeEvent', closeEvent);

    const website = await WA.ui.website.open({
        url: tutorialUrl.href,
        position: { vertical: "middle", horizontal: "middle" },
        size: { width: "80vw", height: "80vh" },
        allowApi: true,
    });

    WA.event.on(closeEvent).subscribe(() => website.close());

    bootstrapExtra().then(() => {
        console.info('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};

/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.info('Party event script started');

const DEFAULT_STREAM_URL = 'https://vkvideo.ru/video_ext.php?oid=-175168891&id=456241501&hd=3&autoplay=1';

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

    // Stream zone: open side panel + highlight on enter, close on leave
    let streamPanel: Awaited<ReturnType<typeof WA.ui.website.open>> | null = null;

    WA.room.area.onEnter('streamZone').subscribe(async () => {
        const configured = WA.state.loadVariable('streamURL');
        const streamUrl = (typeof configured === 'string' && configured)
            ? configured
            : DEFAULT_STREAM_URL;
        const mutedUrl = streamUrl.includes('?')
            ? `${streamUrl}&mute=1`
            : `${streamUrl}?mute=1`;

        streamPanel = await WA.ui.website.open({
            url: mutedUrl,
            position: { vertical: "middle", horizontal: "right" },
            size: { width: "40%", height: "80%" },
            allowApi: false,
            allowPolicy: "autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock",
        });

        WA.room.showLayer('stream-zone-highlight');
    });

    WA.room.area.onLeave('streamZone').subscribe(async () => {
        if (streamPanel) {
            await streamPanel.close();
            streamPanel = null;
        }
        WA.room.hideLayer('stream-zone-highlight');
    });

    bootstrapExtra().then(() => {
        console.info('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};

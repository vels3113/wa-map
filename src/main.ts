/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.info('Party event script started');

WA.onInit().then(() => {
    console.info('Scripting API ready');

    WA.ui.openPopup("tutorialAnchor", `
        <div style="min-width:360px">
        <h3>Добро пожаловать на вечеринку! 🎉</h3>
        <p>👀 <strong>Внимание:</strong> по умолчанию все, кто рядом с тобой на карте, тебя видят и слышат — и ты их тоже.</p>
        <p>На карте три зоны:</p>
        <ul>
            <li>🎙 <strong>Jitsi</strong> — общий созвон для всех. Найди зону <em>справа внизу</em>.</li>
            <li>📺 <strong>Стримы</strong> — смотрим Формулу 1. Найди зону <em>справа вверху</em>.</li>
            <li>🧠 <strong>Своя игра</strong> — зона для игры. Найди <em>внизу</em> или следуй указателям на карте.</li>
        </ul>
        <p>Используй стрелки для передвижения. Зайди в зону — и она активируется автоматически.</p>
        </div>
    `, [
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

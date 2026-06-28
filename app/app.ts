import express, { Request, Response, NextFunction } from 'express';
import core from '@workadventure/map-starter-kit-core/dist/server.js';

const app = express();

app.use('/maps/list', (_req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    (res as any).json = (data: unknown) => {
        if (Array.isArray(data)) {
            data = (data as any[]).filter((map) => !map.path?.startsWith('extra/') && map.path !== 'office.tmj');
        }
        return originalJson(data);
    };
    next();
});

app.use(core as any);

export const viteNodeApp = app;

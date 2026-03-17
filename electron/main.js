import fs from 'node:fs';
import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path';
import { bootstrapData, fetchAnalysis, fetchNews } from './news-service.js';
function loadProjectEnv() {
    const candidates = [
        path.resolve(process.cwd(), '.env'),
        path.resolve(__dirname, '../../.env'),
    ];
    for (const envPath of candidates) {
        if (!fs.existsSync(envPath))
            continue;
        const contents = fs.readFileSync(envPath, 'utf8');
        for (const line of contents.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#'))
                continue;
            const normalized = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
            const separator = normalized.indexOf('=');
            if (separator <= 0)
                continue;
            const key = normalized.slice(0, separator).trim();
            if (!key || process.env[key] !== undefined)
                continue;
            let value = normalized.slice(separator + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
        return;
    }
}
loadProjectEnv();
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
async function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 840,
        minWidth: 1024,
        minHeight: 700,
        backgroundColor: '#0f1115',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.webContents.on('did-fail-load', (_event, code, description, validatedUrl) => {
        console.error('[main] renderer failed to load:', { code, description, validatedUrl });
    });
    const devServerUrl = process.env.VITE_DEV_SERVER_URL || (!app.isPackaged ? 'http://localhost:5173' : '');
    if (devServerUrl) {
        await win.loadURL(devServerUrl);
    }
    else {
        await win.loadFile(path.join(__dirname, '../../dist/index.html'));
    }
}
app.whenReady().then(async () => {
    try {
        await bootstrapData();
        ipcMain.handle('news:fetch', async (_e, query) => {
            return fetchNews(query);
        });
        ipcMain.handle('analysis:fetch', async (_e, articleId) => {
            return fetchAnalysis(articleId);
        });
        await createWindow();
    }
    catch (error) {
        console.error('[main] bootstrap failed:', error);
        app.quit();
    }
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

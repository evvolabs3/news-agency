import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('newsBridge', {
    fetchNews: (query) => ipcRenderer.invoke('news:fetch', query),
    fetchAnalysis: (articleId) => ipcRenderer.invoke('analysis:fetch', articleId),
});

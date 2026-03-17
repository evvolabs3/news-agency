import { contextBridge, ipcRenderer } from 'electron';
import type { AnalysisResult, Article, NewsQuery } from '../src/shared/types';

contextBridge.exposeInMainWorld('newsBridge', {
  fetchNews: (query: NewsQuery): Promise<Article[]> => ipcRenderer.invoke('news:fetch', query),
  fetchAnalysis: (articleId: string): Promise<AnalysisResult> =>
    ipcRenderer.invoke('analysis:fetch', articleId),
});

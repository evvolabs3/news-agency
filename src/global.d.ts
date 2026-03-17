import type { AnalysisResult, Article, NewsQuery } from './shared/types';

declare global {
  interface Window {
    newsBridge: {
      fetchNews: (query: NewsQuery) => Promise<Article[]>;
      fetchAnalysis: (articleId: string) => Promise<AnalysisResult>;
    };
  }
}

export {};

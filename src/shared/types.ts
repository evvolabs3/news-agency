export type Category =
  | 'All'
  | 'Technology'
  | 'Politics'
  | 'UK'
  | 'US'
  | 'International';

export type NewsSource = 'BBC' | 'APNews';

export interface Article {
  id: string;
  title: string;
  source: NewsSource;
  category: Category;
  author?: string;
  publishedAt: string;
  summary: string;
  content: string;
  url: string;
}

export interface AnalysisResult {
  articleId: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  score: number;
  keyTopics: string[];
}

export interface NewsQuery {
  category: Category;
  source: NewsSource | 'All';
  search: string;
}

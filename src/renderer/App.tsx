import { useEffect, useMemo, useState } from 'react';
import type { AnalysisResult, Article, Category, NewsQuery, NewsSource } from '../shared/types';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ArticleDetail } from './components/ArticleDetail';
import { ArticleList } from './components/ArticleList';
import { FilterBar } from './components/FilterBar';

const defaultQuery: NewsQuery = {
  category: 'All',
  source: 'All',
  search: '',
};

export function App() {
  const [query, setQuery] = useState<NewsQuery>(defaultQuery);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const bridge = window.newsBridge;
  const bridgeReady = typeof bridge !== 'undefined';

  useEffect(() => {
    if (!bridgeReady) return;

    setLoading(true);
    bridge
      .fetchNews(query)
      .then((rows) => {
        setArticles(rows);
        if (!rows.some((r) => r.id === selectedId)) setSelectedId(rows[0]?.id ?? '');
      })
      .finally(() => setLoading(false));
  }, [bridgeReady, bridge, query, selectedId]);

  useEffect(() => {
    if (!bridgeReady || !selectedId) return;
    bridge.fetchAnalysis(selectedId).then(setAnalysis);
  }, [bridgeReady, bridge, selectedId]);

  const selected = useMemo(() => articles.find((a) => a.id === selectedId) ?? null, [articles, selectedId]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>News Intelligence Dashboard</h1>
        <p>BBC + APNews aggregation, filtering, and sentiment view</p>
      </header>

      {!bridgeReady ? (
        <section className="panel" style={{ marginBottom: 16 }}>
          <strong>Electron bridge not detected.</strong>
          <p className="muted" style={{ marginTop: 8 }}>
            Open this app via <code>npm run dev</code> so Electron can attach to the renderer.
            Visiting <code>http://localhost:5173</code> in a normal browser only loads the React shell and
            will not fetch live news because the NewsAPI call runs in the Electron main process.
          </p>
        </section>
      ) : null}

      <FilterBar
        query={query}
        onCategory={(value: Category) => setQuery((q) => ({ ...q, category: value }))}
        onSource={(value: NewsSource | 'All') => setQuery((q) => ({ ...q, source: value }))}
        onSearch={(value: string) => setQuery((q) => ({ ...q, search: value }))}
      />

      <main className="content-grid">
        <ArticleList loading={loading} articles={articles} selectedId={selectedId} onSelect={setSelectedId} />
        <ArticleDetail article={selected} />
        <AnalysisDashboard analysis={analysis} article={selected} />
      </main>
    </div>
  );
}

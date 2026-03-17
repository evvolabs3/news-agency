import type { Article } from '../../shared/types';

interface Props {
  loading: boolean;
  articles: Article[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ArticleList({ loading, articles, selectedId, onSelect }: Props) {
  return (
    <section className="panel">
      <h2>Articles</h2>
      {loading ? <div className="muted">Loading…</div> : null}
      {!loading && articles.length === 0 ? <div className="muted">No matches.</div> : null}
      <ul className="article-list">
        {articles.map((article) => (
          <li
            key={article.id}
            className={article.id === selectedId ? 'article-item selected' : 'article-item'}
            onClick={() => onSelect(article.id)}
          >
            <div className="row">
              <strong>{article.title}</strong>
              <span className="tag">{article.source}</span>
            </div>
            <div className="row muted">
              <span>{article.category}</span>
              <span>{new Date(article.publishedAt).toLocaleString()}</span>
            </div>
            <p>{article.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

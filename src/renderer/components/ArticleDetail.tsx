import type { Article } from '../../shared/types';

export function ArticleDetail({ article }: { article: Article | null }) {
  return (
    <section className="panel">
      <h2>Article Detail</h2>
      {!article ? (
        <div className="muted">Select an article</div>
      ) : (
        <>
          <h3>{article.title}</h3>
          <div className="muted">
            {article.source} • {article.author || 'Unknown author'}
          </div>
          <p>{article.content}</p>
          <a href={article.url} target="_blank" rel="noreferrer" className="link">
            Open source article
          </a>
        </>
      )}
    </section>
  );
}

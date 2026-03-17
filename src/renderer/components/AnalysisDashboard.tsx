import type { AnalysisResult, Article } from '../../shared/types';

interface Props {
  analysis: AnalysisResult | null;
  article: Article | null;
}

export function AnalysisDashboard({ analysis, article }: Props) {
  return (
    <section className="panel">
      <h2>Analysis Dashboard</h2>
      {!article ? <div className="muted">Choose article to view analysis.</div> : null}
      {article && !analysis ? <div className="muted">Running analysis…</div> : null}
      {analysis ? (
        <div className="analysis">
          <div className="metric">
            <span className="muted">Sentiment</span>
            <strong>{analysis.sentiment}</strong>
          </div>
          <div className="metric">
            <span className="muted">Score</span>
            <strong>{analysis.score}</strong>
          </div>
          <div className="metric">
            <span className="muted">Topics</span>
            <div className="chips">
              {analysis.keyTopics.map((topic) => (
                <span key={topic} className="chip">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

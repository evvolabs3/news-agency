import type { Category, NewsQuery, NewsSource } from '../../shared/types';

const CATEGORIES: Category[] = ['All', 'Technology', 'Politics', 'UK', 'US', 'International'];
const SOURCES: Array<NewsSource | 'All'> = ['All', 'BBC', 'APNews'];

interface Props {
  query: NewsQuery;
  onCategory: (value: Category) => void;
  onSource: (value: NewsSource | 'All') => void;
  onSearch: (value: string) => void;
}

export function FilterBar({ query, onCategory, onSource, onSearch }: Props) {
  return (
    <section className="panel filters">
      <label>
        Category
        <select value={query.category} onChange={(e) => onCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label>
        Source
        <select value={query.source} onChange={(e) => onSource(e.target.value as NewsSource | 'All')}>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="search-box">
        Search
        <input
          value={query.search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Find by title or summary"
        />
      </label>
    </section>
  );
}

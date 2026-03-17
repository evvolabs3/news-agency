import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ArticleDetail } from './components/ArticleDetail';
import { ArticleList } from './components/ArticleList';
import { FilterBar } from './components/FilterBar';
const defaultQuery = {
    category: 'All',
    source: 'All',
    search: '',
};
export function App() {
    const [query, setQuery] = useState(defaultQuery);
    const [articles, setArticles] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const bridge = window.newsBridge;
    const bridgeReady = typeof bridge !== 'undefined';
    useEffect(() => {
        if (!bridgeReady)
            return;
        setLoading(true);
        bridge
            .fetchNews(query)
            .then((rows) => {
            setArticles(rows);
            if (!rows.some((r) => r.id === selectedId))
                setSelectedId(rows[0]?.id ?? '');
        })
            .finally(() => setLoading(false));
    }, [bridgeReady, bridge, query, selectedId]);
    useEffect(() => {
        if (!bridgeReady || !selectedId)
            return;
        bridge.fetchAnalysis(selectedId).then(setAnalysis);
    }, [bridgeReady, bridge, selectedId]);
    const selected = useMemo(() => articles.find((a) => a.id === selectedId) ?? null, [articles, selectedId]);
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "topbar", children: [_jsx("h1", { children: "News Intelligence Dashboard" }), _jsx("p", { children: "BBC + APNews aggregation, filtering, and sentiment view" })] }), !bridgeReady ? (_jsxs("section", { className: "panel", style: { marginBottom: 16 }, children: [_jsx("strong", { children: "Electron bridge not detected." }), _jsxs("p", { className: "muted", style: { marginTop: 8 }, children: ["Open this app via ", _jsx("code", { children: "npm run dev" }), " so Electron can attach to the renderer. Visiting ", _jsx("code", { children: "http://localhost:5173" }), " in a normal browser only loads the React shell and will not fetch live news because the NewsAPI call runs in the Electron main process."] })] })) : null, _jsx(FilterBar, { query: query, onCategory: (value) => setQuery((q) => ({ ...q, category: value })), onSource: (value) => setQuery((q) => ({ ...q, source: value })), onSearch: (value) => setQuery((q) => ({ ...q, search: value })) }), _jsxs("main", { className: "content-grid", children: [_jsx(ArticleList, { loading: loading, articles: articles, selectedId: selectedId, onSelect: setSelectedId }), _jsx(ArticleDetail, { article: selected }), _jsx(AnalysisDashboard, { analysis: analysis, article: selected })] })] }));
}

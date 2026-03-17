import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CATEGORIES = ['All', 'Technology', 'Politics', 'UK', 'US', 'International'];
const SOURCES = ['All', 'BBC', 'APNews'];
export function FilterBar({ query, onCategory, onSource, onSearch }) {
    return (_jsxs("section", { className: "panel filters", children: [_jsxs("label", { children: ["Category", _jsx("select", { value: query.category, onChange: (e) => onCategory(e.target.value), children: CATEGORIES.map((c) => (_jsx("option", { value: c, children: c }, c))) })] }), _jsxs("label", { children: ["Source", _jsx("select", { value: query.source, onChange: (e) => onSource(e.target.value), children: SOURCES.map((s) => (_jsx("option", { value: s, children: s }, s))) })] }), _jsxs("label", { className: "search-box", children: ["Search", _jsx("input", { value: query.search, onChange: (e) => onSearch(e.target.value), placeholder: "Find by title or summary" })] })] }));
}

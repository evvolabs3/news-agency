import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function ArticleDetail({ article }) {
    return (_jsxs("section", { className: "panel", children: [_jsx("h2", { children: "Article Detail" }), !article ? (_jsx("div", { className: "muted", children: "Select an article" })) : (_jsxs(_Fragment, { children: [_jsx("h3", { children: article.title }), _jsxs("div", { className: "muted", children: [article.source, " \u2022 ", article.author || 'Unknown author'] }), _jsx("p", { children: article.content }), _jsx("a", { href: article.url, target: "_blank", rel: "noreferrer", className: "link", children: "Open source article" })] }))] }));
}

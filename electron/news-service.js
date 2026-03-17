import { buildAnalysis } from './analysis.js';
import { deleteArticleById, initDb, queryArticles, upsertArticles } from './db.js';
import { fetchFromNewsApi } from './news-api.js';
const fallbackArticles = [
    {
        id: 'fallback-1',
        title: 'NewsAPI credentials missing/unavailable: showing fallback sample article',
        source: 'BBC',
        category: 'Technology',
        author: 'System',
        publishedAt: new Date().toISOString(),
        summary: 'Set NEWS_API_KEY in .env to enable live BBC/APNews ingestion.',
        content: 'Configure NEWS_API_KEY in your environment and restart Electron to fetch live data.',
        url: 'https://newsapi.org/',
    },
];
let hasSyncedOnce = false;
export async function bootstrapData() {
    initDb();
    await syncLatestNews();
}
export async function syncLatestNews() {
    const apiKey = process.env.NEWS_API_KEY?.trim();
    if (!apiKey) {
        console.warn('[news-service] NewsAPI credentials missing. Set NEWS_API_KEY in .env.');
        if (!hasSyncedOnce)
            upsertArticles(fallbackArticles);
        hasSyncedOnce = true;
        return;
    }
    try {
        const fresh = await fetchFromNewsApi(apiKey);
        if (fresh.length > 0) {
            deleteArticleById('fallback-1');
            upsertArticles(fresh);
        }
        hasSyncedOnce = true;
    }
    catch (error) {
        console.error('[news-service] syncLatestNews failed:', error);
        // fail-safe: keep app functional with existing DB content or fallback sample
        const existing = queryArticles({ category: 'All', source: 'All', search: '' });
        if (existing.length === 0) {
            upsertArticles(fallbackArticles);
        }
        hasSyncedOnce = true;
    }
}
export async function fetchNews(query) {
    await syncLatestNews();
    return queryArticles(query);
}
export async function fetchAnalysis(articleId) {
    const rows = queryArticles({ category: 'All', source: 'All', search: '' });
    const article = rows.find((a) => a.id === articleId);
    if (!article) {
        throw new Error(`Article not found: ${articleId}`);
    }
    return buildAnalysis(article);
}

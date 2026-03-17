import crypto from 'node:crypto';
const NEWS_API_BASE = 'https://newsapi.org/v2/top-headlines';
function inferSource(raw) {
    const v = (raw || '').toLowerCase();
    if (v.includes('bbc'))
        return 'BBC';
    return 'APNews';
}
function inferCategory(text) {
    const t = text.toLowerCase();
    if (/ai|tech|software|chip|cloud|startup|cyber|data/.test(t))
        return 'Technology';
    if (/election|policy|parliament|congress|government|minister|president/.test(t))
        return 'Politics';
    if (/uk|britain|england|london/.test(t))
        return 'UK';
    if (/us|u\.s\.|america|washington/.test(t))
        return 'US';
    return 'International';
}
function normalizeArticle(raw) {
    if (!raw.title || !raw.url || !raw.publishedAt)
        return null;
    const source = inferSource(raw.source?.name || raw.source?.id);
    const summary = raw.description?.trim() || raw.content?.trim() || 'Summary unavailable.';
    const content = raw.content?.trim() || raw.description?.trim() || 'Content unavailable.';
    const category = inferCategory(`${raw.title} ${summary} ${content}`);
    return {
        id: crypto.createHash('sha1').update(raw.url).digest('hex'),
        title: raw.title,
        source,
        category,
        author: raw.author || undefined,
        publishedAt: raw.publishedAt,
        summary,
        content,
        url: raw.url,
    };
}
export async function fetchFromNewsApi(apiKey) {
    const resolvedKey = apiKey.trim();
    if (!resolvedKey) {
        throw new Error('Missing NewsAPI credentials. Set NEWS_API_KEY in .env.');
    }
    const params = new URLSearchParams({
        sources: 'bbc-news,associated-press',
        language: 'en',
        pageSize: '50',
        apiKey: resolvedKey,
    });
    const res = await fetch(`${NEWS_API_BASE}?${params.toString()}`);
    if (!res.ok) {
        throw new Error(`News API HTTP ${res.status}`);
    }
    const data = (await res.json());
    if (data.status !== 'ok') {
        throw new Error(data.message || 'News API request failed');
    }
    return (data.articles || []).map(normalizeArticle).filter((v) => v !== null);
}

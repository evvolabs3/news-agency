const STOPWORDS = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'to',
    'of',
    'in',
    'on',
    'for',
    'with',
    'at',
    'from',
    'by',
    'is',
    'are',
    'was',
    'were',
    'be',
    'this',
    'that',
    'it',
]);
const POSITIVE = ['gain', 'growth', 'win', 'improve', 'success', 'record', 'strong', 'breakthrough'];
const NEGATIVE = ['loss', 'decline', 'risk', 'fall', 'war', 'crisis', 'threat', 'concern'];
function scoreSentiment(text) {
    const lower = text.toLowerCase();
    const posHits = POSITIVE.reduce((acc, k) => acc + (lower.includes(k) ? 1 : 0), 0);
    const negHits = NEGATIVE.reduce((acc, k) => acc + (lower.includes(k) ? 1 : 0), 0);
    if (posHits === 0 && negHits === 0)
        return 0;
    return Number(((posHits - negHits) / Math.max(posHits + negHits, 1)).toFixed(2));
}
function pickTopics(text) {
    const counts = new Map();
    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOPWORDS.has(w));
    for (const word of words) {
        counts.set(word, (counts.get(word) || 0) + 1);
    }
    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([word]) => word[0].toUpperCase() + word.slice(1));
}
export function buildAnalysis(article) {
    const text = `${article.title} ${article.summary} ${article.content}`;
    const score = scoreSentiment(text);
    let sentiment = 'Neutral';
    if (score > 0.2)
        sentiment = 'Positive';
    if (score < -0.2)
        sentiment = 'Negative';
    return {
        articleId: article.id,
        sentiment,
        score,
        keyTopics: pickTopics(text),
    };
}

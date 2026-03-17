const fs = require('node:fs');
const path = require('node:path');

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Missing .env file');
    process.exit(1);
  }

  const contents = fs.readFileSync(envPath, 'utf8');
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const normalized = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const separator = normalized.indexOf('=');
    if (separator <= 0) continue;

    const key = normalized.slice(0, separator).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = normalized.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

async function main() {
  loadEnvFile();

  const apiKey = process.env.NEWS_API_KEY?.trim();
  if (!apiKey) {
    console.error('Missing NEWS_API_KEY in .env');
    process.exit(1);
  }

  const { fetchFromNewsApi } = require('../dist-electron/electron/news-api.js');
  const articles = await fetchFromNewsApi(apiKey);

  console.log(`OK articles=${articles.length}`);
  for (const article of articles.slice(0, 5)) {
    console.log(`- ${article.source}: ${article.title}`);
  }
}

main().catch((error) => {
  console.error('check:news failed');
  console.error(error);
  process.exit(1);
});

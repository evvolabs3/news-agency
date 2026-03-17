import fs from 'node:fs';
import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';
import type { Article } from '../src/shared/types';

interface DbArticleRow {
  id: string;
  title: string;
  source: string;
  category: string;
  author: string | null;
  published_at: string;
  summary: string;
  content: string;
  url: string;
  created_at: string;
  updated_at: string;
}

let db: Database.Database | null = null;

function getDbPath(): string {
  const userData = app.getPath('userData');
  const dir = path.join(userData, 'data');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'news_agency.db');
}

function mapRowToArticle(row: DbArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    source: row.source as Article['source'],
    category: row.category as Article['category'],
    author: row.author ?? undefined,
    publishedAt: row.published_at,
    summary: row.summary,
    content: row.content,
    url: row.url,
  };
}

export function initDb(): Database.Database {
  if (db) return db;

  db = new Database(getDbPath());
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      source TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT,
      published_at TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
  `);

  return db;
}

export function upsertArticles(articles: Article[]): void {
  const database = initDb();

  const stmt = database.prepare(`
    INSERT INTO articles (
      id, title, source, category, author, published_at, summary, content, url, created_at, updated_at
    ) VALUES (
      @id, @title, @source, @category, @author, @publishedAt, @summary, @content, @url, datetime('now'), datetime('now')
    )
    ON CONFLICT(url) DO UPDATE SET
      title = excluded.title,
      source = excluded.source,
      category = excluded.category,
      author = excluded.author,
      published_at = excluded.published_at,
      summary = excluded.summary,
      content = excluded.content,
      updated_at = datetime('now')
  `);

  const tx = database.transaction((rows: Article[]) => {
    for (const article of rows) {
      stmt.run(article);
    }
  });

  tx(articles);
}

export function deleteArticleById(id: string): void {
  const database = initDb();
  database.prepare('DELETE FROM articles WHERE id = ?').run(id);
}

export function queryArticles(params: { category: string; source: string; search: string }): Article[] {
  const database = initDb();

  const rows = database
    .prepare(
      `
      SELECT id, title, source, category, author, published_at, summary, content, url, created_at, updated_at
      FROM articles
      WHERE
        (@category = 'All' OR category = @category)
        AND (@source = 'All' OR source = @source)
        AND (
          @search = '' OR
          lower(title) LIKE '%' || lower(@search) || '%' OR
          lower(summary) LIKE '%' || lower(@search) || '%'
        )
      ORDER BY datetime(published_at) DESC
      LIMIT 200
    `,
    )
    .all(params) as DbArticleRow[];

  return rows.map(mapRowToArticle);
}

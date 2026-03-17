# News Gathering/Filtering and Analysis Electron App
The purpose is to build a news gathering/filtering and analysis Electron app that can fetch news from BBC/APNews, filter them by news categories (e.g. Technology, Politics, UK, US, International), and analyze the sentiment of the articles. The app will have a modern, flat and bold interface for displaying the news articles and their analysis results (analyse what exacly can be placeholder).

# Frontend Stack
Electron
React + TypeScript for UI

# Backend Stack
Electron
SQLite
use News API from https://newsapi.org/


# Architecture
Consist of 4 layers:
1.Renderer layer:
UI pages
charts, filters, article list, article detail, analysis dashboard

2. Electron bridge layer
preload + IPC
communication between renderer and main process

3. Application/service layer
fetch BBC/APNews data
normalize article shape
run analysis
query database

4. Persistence layer
SQLite database
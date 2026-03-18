# CSVWizard

A free, client-side CSV/TSV viewer, editor, and converter. Sort, filter, edit cells inline, and export to JSON, SQL, XML, and more.

**[Live Demo](https://csv-wizard-pedromussi1s-projects.vercel.app/)**

## Features

- **CSV/TSV Parser** — Auto-detects delimiter (comma, tab, semicolon, pipe)
- **Multiple Input Methods** — File upload, drag-and-drop, or paste text
- **Interactive Table** — Column sorting (auto-detects numeric vs text), global row filter, inline cell editing (double-click)
- **Row Management** — Add and delete rows
- **Export Formats** — CSV, TSV, JSON, SQL INSERT (configurable table name), XML
- **Copy to Clipboard** — One-click copy as JSON or CSV
- **Dark/Light Theme** — Persisted in localStorage
- **Virtualized Rendering** — Handles large files (10K+ rows) smoothly by only rendering visible rows
- **Client-Side Only** — No data sent to any server

## Tech Stack

- Next.js 16 + TypeScript + Tailwind CSS
- Row virtualization for large datasets
- Debounced filtering

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy

Deploy on [Vercel](https://vercel.com/new) by importing the GitHub repo. No configuration needed.

## License

MIT

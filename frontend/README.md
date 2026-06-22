# Prelegal Frontend

Next.js static-export frontend for the Prelegal legal document creator.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). API calls are proxied to the FastAPI backend at `:8000` in production (single Docker container).

## Brand & UI

Design tokens are CSS variables in `src/app/globals.css`:

| Token | Value | Tailwind class |
|-------|-------|----------------|
| Navy | `#032147` | `text-brand-navy` |
| Blue | `#209dd7` | `text-brand-blue`, `btn-secondary` |
| Purple | `#753991` | `text-brand-purple`, `btn-primary` |
| Yellow | `#ecad0a` | `text-brand-yellow` |
| Gray | `#888888` | `text-brand-gray` |

Public assets in `public/`:

- `logo.svg` — App icon / favicon
- `hero-pattern.svg` — Page background (referenced by `.app-shell`)
- `site.webmanifest` — PWA manifest

Key components:

- `BrandLogo` — Logo + wordmark for header and auth modal
- `ChatInterface` — AI conversation panel
- `DocumentPreview` — Live document preview
- `AuthModal`, `DocumentsModal`, `UserMenu` — Auth and document management

See the root [README](../README.md) for full project documentation.

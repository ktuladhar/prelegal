# Prelegal

A platform for drafting common legal agreements through AI-assisted conversation. Describe what you need in chat, and Prelegal extracts fields into a live document preview with PDF download.

Built with FastAPI, Next.js, and LiteLLM via OpenRouter. Document templates are based on [CommonPaper](https://commonpaper.com/) standard terms.

## Features

- **AI chat drafting** — Conversational field extraction via LiteLLM/OpenRouter with structured outputs
- **11 document types** — Mutual NDA, Cloud Service Agreement, Pilot Agreement, Design Partner, SLA, Professional Services, Partnership, Software License, DPA, BAA, and AI Addendum (see `catalog.json`)
- **Live preview & PDF export** — Preview updates as fields are gathered; download when complete
- **User accounts** — Sign up, sign in, and save documents to your account
- **Light & dark themes** — Toggle in the header; preference is saved locally
- **Docker deployment** — Single container serving the static Next.js frontend and FastAPI backend

## Quick Start

### Prerequisites

- Docker and Docker Compose
- An OpenRouter API key for AI chat

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ktuladhar/prelegal.git
   cd prelegal
   ```

2. Create a `.env` file at the project root:

   ```bash
   cp .env.example .env
   ```

   Add your key:

   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

### Running the Application

**Mac/Linux:**

```bash
./scripts/start-mac.sh    # or start-linux.sh
```

**Windows:**

```powershell
.\scripts\start-windows.ps1
```

Open [http://localhost:8000](http://localhost:8000)

### Stopping the Application

**Mac/Linux:**

```bash
./scripts/stop-mac.sh    # or stop-linux.sh
```

**Windows:**

```powershell
.\scripts\stop-windows.ps1
```

## Development

### Frontend only

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend only

```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

API at [http://localhost:8000](http://localhost:8000)

### Tests

```bash
cd frontend
npm test
```

## Project Structure

```
prelegal/
  backend/         # FastAPI backend (SQLite, auth, AI chat, documents)
  frontend/        # Next.js frontend (static export)
  scripts/         # Start/stop scripts (Mac, Linux, Windows)
  templates/       # Legal document templates (CommonPaper, CC BY 4.0)
  catalog.json     # Document type catalog
  .claude/         # Claude Code skills and project instructions
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/signin` | Sign in (JWT in HttpOnly cookie) |
| `POST` | `/api/auth/signout` | Sign out |
| `GET` | `/api/auth/me` | Current user |

### Documents (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/documents` | List saved documents |
| `POST` | `/api/documents` | Save document |
| `GET` | `/api/documents/{id}` | Get document |
| `PUT` | `/api/documents/{id}` | Update document |
| `DELETE` | `/api/documents/{id}` | Delete document |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/chat/greeting` | AI greeting |
| `POST` | `/api/chat/message` | Send message and receive AI response |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |

## Document Templates

Legal templates in `templates/` are sourced from [CommonPaper](https://github.com/CommonPaper) and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See `catalog.json` for the full list.

## Design & Branding

### Color palette

Defined in `frontend/src/app/globals.css`:

| Token | Light | Usage |
|-------|-------|-------|
| Navy | `#032147` | Headings, primary text |
| Blue | `#209dd7` | Links, secondary actions, AI accents |
| Purple | `#753991` | Primary buttons (Sign In, Send) |
| Yellow | `#ecad0a` | Accent highlights |
| Gray | `#888888` | Secondary text |

Dark mode uses the same brand accents with adjusted surfaces and text colors via CSS variables on `[data-theme="dark"]`.

### Typography

| Context | Font |
|---------|------|
| UI (chat, nav, modals) | [Inter](https://fonts.google.com/specimen/Inter) |
| Document preview & PDFs | [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) |

### Brand assets

Files in `frontend/public/`:

- `logo.svg` — App icon and favicon (document + AI sparkle motif)
- `hero-pattern.svg` — Light-mode page background with brand-color glows
- `site.webmanifest` — PWA manifest with theme colors
- `fonts/source-serif-4/` — Embedded serif fonts for PDF generation

### UI components

Shared CSS classes (`btn-primary`, `panel-card`, `badge-purple`, etc.) live in `globals.css`. Key React components:

- `BrandLogo` — Header and auth modal branding
- `ThemeToggle` — Light/dark theme switcher in the header
- `ChatInterface` — AI conversation panel
- `DocumentPreview` — Live document preview
- `AuthModal`, `DocumentsModal`, `UserMenu` — Auth and document management

See `CLAUDE.md` for full project conventions and implementation notes.

## License

Source code is licensed under the [MIT License](LICENSE) — Copyright (c) 2026 Kaushal Dhar Tuladhar.

Document templates are not covered by the MIT License; they remain under CC BY 4.0 as noted above.

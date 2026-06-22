# Prelegal

A SaaS platform for drafting common legal agreements through AI-assisted conversation. Users describe what they need in chat, and the app extracts fields into a live document preview with PDF download.

This project was built by running Jira tickets through Claude Code. You can follow the same workflow yourself — see the skills in the `.claude` directory.

If you have skills to add or more instructions to contribute, please add them to `community_contributions` and send a PR.

## Features

- **AI chat drafting** — Conversational field extraction via LiteLLM/OpenRouter with structured outputs
- **11 document types** — Mutual NDA, Cloud Service Agreement, Pilot Agreement, Design Partner, SLA, Professional Services, Partnership, Software License, DPA, BAA, AI Addendum, and more (see `catalog.json`)
- **Live preview & PDF export** — Document updates as fields are gathered; download when complete
- **User accounts** — Sign up, sign in, and save documents to your account
- **Docker deployment** — Single container serving the static Next.js frontend and FastAPI backend

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- An `OPENROUTER_API_KEY` in a `.env` file at the project root (for AI chat)

### Running the Application

**Mac/Linux:**

```bash
./scripts/start-mac.sh    # or start-linux.sh
```

**Windows:**

```powershell
.\scripts\start-windows.ps1
```

The application will be available at [http://localhost:8000](http://localhost:8000)

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

### Frontend Only

```bash
cd frontend
npm install
npm run dev
```

Available at [http://localhost:3000](http://localhost:3000)

### Backend Only

```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

Available at [http://localhost:8000](http://localhost:8000)

## Project Structure

```
prelegal/
  backend/         # FastAPI backend (SQLite, auth, AI chat, documents)
  frontend/        # Next.js frontend (static export)
  scripts/         # Start/stop scripts (Mac, Linux, Windows)
  templates/       # Legal document templates (CommonPaper, CC BY 4.0)
  catalog.json     # Document type catalog
```

## API Endpoints

### Auth

- `POST /api/auth/signup` — Create account
- `POST /api/auth/signin` — Sign in (JWT in HttpOnly cookie)
- `POST /api/auth/signout` — Sign out
- `GET /api/auth/me` — Current user

### Documents (auth required)

- `GET /api/documents` — List saved documents
- `POST /api/documents` — Save document
- `GET /api/documents/{id}` — Get document
- `PUT /api/documents/{id}` — Update document
- `DELETE /api/documents/{id}` — Delete document

### Chat

- `GET /api/chat/greeting` — AI greeting
- `POST /api/chat/message` — Send message and receive AI response

### Other

- `GET /api/health` — Health check

## Document Templates

Legal templates in `templates/` are sourced from [CommonPaper](https://github.com/CommonPaper) and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See `catalog.json` for the full list.

## Design & Branding

The UI uses a consistent brand palette defined in `frontend/src/app/globals.css` and documented in `CLAUDE.md`:

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#032147` | Headings, primary text |
| Blue | `#209dd7` | Links, secondary actions, AI accents |
| Purple | `#753991` | Primary buttons (Sign In, Send) |
| Yellow | `#ecad0a` | Accent highlights |
| Gray | `#888888` | Secondary text |

Brand assets live in `frontend/public/`:

- `logo.svg` — App icon and favicon (document + AI sparkle motif)
- `hero-pattern.svg` — Subtle background gradient with grid overlay
- `site.webmanifest` — PWA manifest with theme colors

Shared UI classes (`btn-primary`, `btn-secondary`, `panel-card`, `badge-purple`, etc.) are in `globals.css`. The `BrandLogo` component is used in the header and auth modal.

## License

This project’s source code is licensed under the [MIT License](LICENSE).

Document templates are not covered by the MIT License; they remain under CC BY 4.0 as noted above.
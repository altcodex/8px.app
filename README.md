# web-toolkit (8px.app)

A collection of useful tools for web developers.

## Project Structure

```
/
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   └── components/ # React components (to be added)
│   └── ...
└── backend/          # FastAPI backend
    ├── src/          # FastAPI application
    └── ...
```

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **ESLint 9** with neostandard

### Backend
- **Python 3.12**
- **FastAPI**
- **Pillow** (image processing)
- **NumPy** (k-means clustering)

### Deployment
- **Frontend**: Vercel (static export)
- **Backend**: Vercel Serverless Functions
- **Database**: Firebase Firestore

## Features (Planned)

- Color palette tool with perceptual lightness adjustment
- Favicon generator
- Image corner rounder
- Seed-based geometric avatar generator
- Image-to-palette color extractor (FastAPI + numpy k-means++)
- SVG icon optimizer
- Accessibility checker
- Share functionality (anonymous, URL-based)

## Getting Started

### Quick Start (Docker Compose - Recommended)

```bash
# Setup environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Start development environment
./run-dev.sh
```

Visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Manual Setup

#### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Visit: http://localhost:3000

#### Backend

```bash
cd backend
cp .env.example .env
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn src.app.main:app --reload
```

Visit: http://localhost:8000

## Development

### Docker Compose (Recommended)
- Start: `./run-dev.sh`
- View logs: `docker compose logs -f`
- Stop: `docker compose down`

### Manual
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && source venv/bin/activate && uvicorn src.app.main:app --reload`

### Code Quality
- Frontend lint: `cd frontend && npm run lint`
- Frontend type check: `cd frontend && npm run type-check`
- Backend lint: `cd backend && source venv/bin/activate && ruff check src/`
- Backend type check: `cd backend && source venv/bin/activate && mypy src/`

## License

AGPL-3.0

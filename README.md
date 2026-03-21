# Solarapp PWA

A PWA for monitoring solar panel production using the [Shinemonitor API](https://github.com/sittzon/shinemonitor_api).

## Architecture

- **Frontend**: Svelte 5 + Vite (SPA served via Nginx)
- **Backend**: FastAPI (shinemonitor_api submodule)
- **PWA**: Offline-capable with service worker

## Quick Start

1. Configure API credentials in `shinemonitor_api/config.py`

2. Build and run with Docker:
```bash
docker-compose up -d --build
```

3. Access the app at http://localhost:5173

## Services

| Service | Port | Description |
|---------|------|-------------|
| App | 5173 | Svelte PWA frontend |
| API | 8000 | Shinemonitor API backend |

## Development

### Frontend
```bash
npm install
npm run dev
```

### API
## API Setup
The API uses the shinemonitor_api submodule. See separate README instructions for setup.

## Configuration

### API Credentials
Edit `shinemonitor_api/config.py`:
```python
usr = "your_username"
pwd = "your_password"
companykey = "your_company_key"
plantId = "your_plant_id"
pn = "your_pn"
sn = "your_sn"
devcode = "your_devcode"
debug = 1
```

### API URL (Docker)
The API URL is baked into the frontend at build time via `VITE_API_URL`. In docker-compose, it defaults to `http://api:8000/`.

For local development, create a `.env` file:
```
VITE_API_URL=http://localhost:8000/
```

## PWA

The app is installable as a Progressive Web App. Use the share/install button in your mobile browser to add it to your home screen.

## Docker Commands

```bash
docker-compose up -d --build    # Build and start
docker-compose down             # Stop
docker-compose logs -f         # View logs
docker-compose logs -f api     # View API logs only
```

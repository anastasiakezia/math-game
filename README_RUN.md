
## Run locally (development)

Requirements: Node.js, npm, Docker (optional)

### Option A - Run with Docker Compose (recommended for dev parity)
1. Install Docker & Docker Compose
2. From project root run:
   docker-compose up --build
3. Backend API will be available on http://localhost:5000
4. Frontend dev server can be run separately (see frontend instructions).

### Run backend locally (without docker)
cd backend
npm install
# set environment variables or copy .env.example to .env
node server.js

### Run frontend locally
cd frontend
npm install
npm run dev
# Open http://localhost:3000

### Deploy hints
- Frontend: build with `npm run build` and deploy to Netlify / Vercel.
- Backend: deploy to Render/Heroku. Ensure DB credentials are set in environment variables.

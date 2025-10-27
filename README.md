Math Game Niki - Project scaffold
==================================

This repository contains a full-stack scaffold for the educational math game described by the user.
It includes:
- frontend/  -> Vite + React + Tailwind source (skeleton)
- backend/   -> Node.js + Express + Sequelize API (skeleton)
- database/  -> init.sql with schema and dummy data
- docker-compose.yml -> for local development: mysql + backend (serving static frontend build if needed)
- README with run instructions (this file)

Notes:
- Replace placeholder assets in public/assets/images and public/assets/audio with your real files.
- Frontend and backend are ready-to-edit. To run full app locally with docker-compose, follow the README below.


---
## Deploy hints (Netlify + Render)
### Frontend (Netlify)
1. Build the frontend: 
   cd frontend
   npm install
   npm run build
2. Drag & drop the `dist/` folder content to Netlify (or connect Git repo and set build command `npm run build` and publish directory `dist`).
3. Ensure the frontend's API base points to your backend URL (in development we used proxy `/api` -> `http://localhost:5000`). In production, update axios base or set environment variable to backend URL.

### Backend (Render)
1. Create a new Web Service on Render or similar platform.
2. Set start command: `npm start` in backend folder.
3. Set environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, PORT.
4. For managed MySQL, Render provides a managed DB service; configure connection strings accordingly.

### Note about placeholders
- Replace image/audio placeholders in `frontend/public/assets/*` with real assets.
- Ensure file names match those referenced in code (egg_1.png ... egg_4.png, dino png names etc).


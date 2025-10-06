Deployment notes (Vercel)

Folder to deploy: public/appointment-frontend

What it contains:
- index.html (appointment UI)
- styles.css, script.js
- api/appointment.js (serverless proxy)

How QR link should look:
https://<your-vercel-app>/?id=<APPOINTMENT_ID>&api=<URL_ENCODED_BACKEND_BASE>

The page will call the local serverless function:
  /appointment-frontend/api/appointment?id=<id>&api=<backend_base>
which forwards the request to:
  <backend_base>/api/appointment/<id>

This allows Vercel frontend to fetch live data from your running backend (local/tunnel) without CORS or localhost issues.



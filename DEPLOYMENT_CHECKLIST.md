# CampusFind Deployment Checklist

## Local
1. MongoDB is running or Atlas is reachable.
2. `server/.env` has `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
3. `npm install` in server.
4. `npm run seed` in server.
5. `npm run dev` in server.
6. Open `http://localhost:5001/api/health`.
7. `npm install` in client.
8. `npm run dev` in client.
9. Login with `student@campusfind.com / Student@123`.

## Vercel frontend
- Root Directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  `VITE_API_URL=https://YOUR-BACKEND-URL/api`

## Vercel backend
- Root Directory: `server`
- Environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLIENT_URL`
- Test:
  `https://YOUR-BACKEND-URL/api/health`

## If frontend says Network Error
Check `VITE_API_URL`, redeploy the frontend after changing it, and verify the backend `/api/health` endpoint in the browser.

## If login says Invalid email or password
Run:
`cd server && npm run seed`
Then use:
- student@campusfind.com / Student@123
- admin@campusfind.com / Admin@123

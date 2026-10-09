# CampusFind — University Lost & Found

A complete academic full-stack project for reporting and recovering items lost or found anywhere on a university campus.

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MongoDB / MongoDB Atlas
- Authentication: JWT + bcrypt
- Icons: Lucide React
- Deployment: Vercel (frontend and optionally backend), MongoDB Atlas

## Main features
- Student/staff registration and JWT login
- Report lost or found items
- Campus-aware locations: block, room, lab, library, hostel, canteen, parking, sports complex
- Search and filters
- Item details
- Claim workflow
- My reports and my claims
- Admin dashboard
- Admin can verify/delete items and approve/reject claims
- Demo data and demo accounts
- Responsive UI

## Demo accounts
Admin:
- Email: admin@campusfind.com
- Password: Admin@123

Student:
- Email: student@campusfind.com
- Password: Student@123

## 1. Run MongoDB
Use local MongoDB or MongoDB Atlas.

## 2. Start backend
```bash
cd server
npm install
copy .env.example .env
# macOS/Linux: cp .env.example .env
npm run seed
npm run dev
```

Backend: http://localhost:5001
Health: http://localhost:5001/api/health

## 3. Start frontend
Open another terminal:
```bash
cd client
npm install
copy .env.example .env
# macOS/Linux: cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173

## Important
The frontend defaults to `http://localhost:5001/api`, so local development also works if you forget to create the client `.env`.

## Deploy frontend to Vercel
Import the repository into Vercel and set the Root Directory to `client`.

Environment variable:
```text
VITE_API_URL=https://YOUR-BACKEND-URL/api
```

## Deploy backend to Vercel
Vercel supports Express applications. Import the repository and set Root Directory to `server`.

Environment variables:
```text
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-long-random-secret
CLIENT_URL=https://YOUR-FRONTEND.vercel.app
```

The included `server/vercel.json` is configured for the Express entry point.

Alternatively, deploy the backend to Render/Railway and point `VITE_API_URL` to it.

## Project structure
```text
campusfind/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
├── server/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
└── README.md
```

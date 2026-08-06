# 🌾 KrishiSeva AI — Smart Farming Assistant

<div align="center">

![KrishiSeva Banner](https://img.shields.io/badge/KrishiSeva-AI%20Smart%20Farming-22c55e?style=for-the-badge&logo=leaf&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)

**An AI-powered Smart Farming Assistant that combines portable soil quality analysis with multilingual government scheme guidance — enabling Indian farmers to improve crop productivity while easily accessing welfare benefits.**

[🚀 Live Demo](https://krishiseva.vercel.app) · [📖 API Docs](./API_DOCUMENTATION.md) · [🗺️ Installation](./INSTALLATION.md)

</div>

---

## ✨ Features

| Module | Description |
|---|---|
| 🌱 **3D Landing Page** | Apple-quality UI with React Three Fiber farmland, AI drone, particle stars, glassmorphism, and custom magnetic cursor |
| 🌐 **100% Multilingual System** | Instant language switcher for **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)** covering all pages, forms, badges, dropdowns, and reminders |
| 📷 **Live Camera Diagnosis** | Built-in device camera stream integration for instant soil & crop photo uploads in Soil Analysis & AI ChatBot |
| 🧪 **AI Soil Analysis** | Enter NPK + pH + Moisture or pair portable Bluetooth NPK sensors → get AI Health Score, crop recommendations, and custom fertilizer dosage |
| 🏛️ **21 Government Schemes** | Comprehensive catalog (PM-KISAN, PMFBY, PMKSY, PM-KUSUM, Soil Health Card, SMAM, PMMSY, RKVY, KCC, etc.) with 6-parameter smart filters & bookmarks |
| 🌦️ **3-Day Weather Telemetry** | Interactive single-banner today's weather with modal popup for 3-day forecast, humidity, wind, and solar radiance metrics |
| 📊 **Smart Dashboard** | Live crop health monitoring, NPK trend charts, yield gain analysis, localized farming reminders, and recent soil diagnostic logs |
| 🤖 **AI ChatBot Assistant** | Voice speech-to-text input, TTS audio playback, image diagnosis, multilingual context switching, powered by Gemini 1.5 Flash |
| 🔔 **Notifications & Alerts** | Real-time per-user notifications with automatic 30-day TTL cleanup |
| 💬 **Feedback System** | Star rating, category tagging, and admin response workflow |
| 👑 **Admin Console** | Analytics overview, user management, broadcast alert system, and full scheme CRUD management |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool + dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Three.js + R3F | 0.185 | 3D farmland scene |
| Framer Motion | 13 | Page transitions + micro-animations |
| GSAP | 3.15 | Magnetic button effects |
| Recharts | 3 | Analytics charts |
| Axios | 1.7 | HTTP client with interceptors |
| React Router | 6 | SPA routing |
| Lucide React | 0.400 | Icon system |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Express.js | 4.19 | REST API framework |
| MongoDB Atlas | - | Cloud database |
| Mongoose | 8.5 | ODM / schema validation |
| JWT | 9.0 | Stateless authentication |
| bcryptjs | 2.4 | Password hashing |
| Helmet | 8.3 | HTTP security headers |
| express-mongo-sanitize | 2.2 | NoSQL injection prevention |
| express-rate-limit | 7.3 | API abuse protection |
| Google Gemini Flash | 0.21 | AI language model |

---

## 📁 Folder Structure

```
YCCE Hackathon/
├── client/                    # React + Vite Frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   └── FarmlandScene.jsx    # Three.js 3D world
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Footer.jsx
│   │   │       ├── Card3D.jsx           # Mouse-tilt 3D cards
│   │   │       ├── CustomCursor.jsx     # Magnetic cursor
│   │   │       ├── LoadingScreen.jsx    # Animated splash
│   │   │       ├── MagneticButton.jsx
│   │   │       └── ErrorBoundary.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # JWT auth state
│   │   │   ├── LanguageContext.jsx      # EN/HI/MR i18n
│   │   │   └── ToastContext.jsx         # Global notifications
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── farmer/
│   │   │   │   ├── Home.jsx             # Dashboard
│   │   │   │   ├── SoilAnalysis.jsx     # Soil module
│   │   │   │   ├── Schemes.jsx          # Scheme finder
│   │   │   │   ├── ChatBot.jsx          # AI assistant
│   │   │   │   └── Profile.jsx
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   └── ErrorPages.jsx           # 404 + Error fallback
│   │   ├── services/
│   │   │   └── api.js                   # Typed Axios helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                    # Design system
│   ├── vercel.json                      # Vercel deployment
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # MongoDB Atlas connection
│   │   ├── controllers/
│   │   │   ├── authController.js        # Register/Login/Profile
│   │   │   ├── soilController.js        # Soil analysis
│   │   │   ├── schemeController.js      # Scheme finder + AI chat
│   │   │   ├── adminController.js       # Admin panel
│   │   │   ├── notificationController.js
│   │   │   └── feedbackController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js        # JWT protect + adminOnly
│   │   │   └── errorMiddleware.js       # Global error handler
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── SoilReport.js
│   │   │   ├── Scheme.js
│   │   │   ├── SchemeApplication.js
│   │   │   ├── ChatHistory.js
│   │   │   ├── Notification.js          # 30-day TTL
│   │   │   └── Feedback.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── soilRoutes.js
│   │   │   ├── schemeRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   └── feedbackRoutes.js
│   │   ├── services/
│   │   │   ├── aiService.js             # Gemini AI integration
│   │   │   └── soilMlService.js         # Soil analysis engine
│   │   ├── app.js                       # Express setup
│   │   └── server.js                    # Entry point
│   ├── .env.example
│   └── package.json
│
├── render.yaml                # Render deployment config
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- Google Gemini API key (optional — offline fallback available)

### 1. Clone & Install

```bash
git clone https://github.com/Safal-48/Smackathon-2026.git
cd Smackathon-2026

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

```bash
# In the server/ directory, create .env
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/krishi_seva
JWT_SECRET=your_super_secret_key_here_minimum_32_chars
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:3000
```

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
cd server
npm start
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Opens http://127.0.0.1:3000
```

### 4. Demo Login
| Role | Phone | Password |
|---|---|---|
| Farmer | `9876543210` | `farmer123` |
| Admin | `9999999999` | `admin123` |

---

## 🌐 Deployment

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and import the GitHub repository
2. Set **Root Directory** to `client`
3. Add environment variable: `VITE_API_URL=https://your-render-app.onrender.com`
4. Deploy — Vercel auto-detects Vite

### Backend → Render

1. Go to [render.com](https://render.com) and create a **New Web Service**
2. Connect the GitHub repository
3. Set **Root Directory** to `server`
4. **Build Command:** `npm install`
5. **Start Command:** `node src/server.js`
6. Add environment variables in the Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `CLIENT_URL` (your Vercel URL)
7. Deploy

### Database → MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Whitelist `0.0.0.0/0` (for Render's dynamic IPs)
4. Copy the connection string into `MONGODB_URI`

---

## 🔑 Key Environment Variables

| Variable | Where | Description |
|---|---|---|
| `MONGODB_URI` | Server | MongoDB Atlas connection string |
| `JWT_SECRET` | Server | JWT signing secret (min 32 chars) |
| `GEMINI_API_KEY` | Server | Google AI Studio API key |
| `CLIENT_URL` | Server | Frontend URL for CORS whitelist |
| `VITE_API_URL` | Client (Vercel) | Backend Render URL |

---

## 👥 Team — YCCE Hackathon 2026

**Project:** Smackathon 2026 — KrishiSeva AI Smart Farming Assistant

---

## 📄 License

MIT License — Free to use, modify and distribute with attribution.

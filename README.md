# 🌾 KrishiSeva AI — Smart Farming Assistant

<div align="center">

![KrishiSeva Banner](https://img.shields.io/badge/KrishiSeva-AI%20Smart%20Farming-22c55e?style=for-the-badge&logo=leaf&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Vercel](https://img.shields.io/badge/Production-Vercel%20Monorepo-000000?style=for-the-badge&logo=vercel)

**An AI-powered Smart Farming Assistant that combines portable soil quality analysis with multilingual government scheme guidance — enabling Indian farmers to improve crop productivity while easily accessing welfare benefits.**

[🚀 Live Production Website](https://krishiseva-ai.vercel.app) · [🤖 AI Voice Assistant](https://krishiseva-ai.vercel.app/chat) · [🗺️ Installation](./INSTALLATION.md)

</div>

---

## ✨ Key Features & Modules

| Module | Description |
|---|---|
| 🌱 **3D Landing Page** | Apple-quality UI with React Three Fiber farmland, AI drone, particle stars, glassmorphism, and custom magnetic cursor |
| 🌐 **100% Multilingual System** | Instant language switcher for **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)** covering all pages, forms, badges, dropdowns, and reminders |
| 📍 **Smart Location Profile** | **Automatic GPS Detection** with reverse geocoding & accuracy metrics + cascading **State ➔ District ➔ Taluka ➔ Village** manual selector |
| 🎙️ **AI Audio Scheme Explainer** | Conversational voice audio explanations for government schemes in Hindi, Marathi, and English (*"PM Kisan mein aapko saal ke ₹6,000 milte hain..."*) |
| 🤖 **2-in-1 Typing + Voice Assistant** | Real-time speech recognition input, natural text-to-speech audio synthesis (`hi-IN`, `mr-IN`, `en-US`), and live 4-bar Audio Wave visualizer |
| 📱 **Dual Phone & Email Auth** | Seamless login & registration using either **10-digit mobile number** or **email address** |
| 📷 **Live Camera Diagnosis** | Built-in device camera stream integration for instant soil & crop photo uploads in Soil Analysis & AI ChatBot |
| 🧪 **AI Soil Quality Diagnostic** | Enter NPK + pH + Moisture or pair portable Bluetooth NPK sensors → get AI Health Score, crop recommendations, and custom fertilizer dosage |
| 🏛️ **21 Government Schemes** | Comprehensive catalog (PM-KISAN, PMFBY, PMKSY, PM-KUSUM, Soil Health Card, SMAM, PMMSY, RKVY, KCC, etc.) with 6-parameter smart filters & bookmarks |
| 🌦️ **3-Day Weather Telemetry** | Interactive single-banner today's weather with modal popup for 3-day forecast, humidity, wind, and solar radiance metrics |
| 📊 **Smart Dashboard** | Live crop health monitoring, NPK trend charts, yield gain analysis, localized farming reminders, and recent soil diagnostic logs |
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

### Backend & Serverless API
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Express.js | 4.19 | REST API framework |
| MongoDB Atlas | - | Cloud database |
| Mongoose | 8.5 | ODM / schema validation |
| JWT | 9.0 | Stateless authentication |
| bcryptjs | 2.4 | Password hashing |
| Google Gemini Flash | 0.21 | AI language model |
| Vercel Serverless | - | Single-domain API functions |

---

## 📁 Folder Structure

```
YCCE Hackathon/
├── api/                       # Vercel Serverless Entrypoint
│   └── index.js
├── client/                    # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   └── FarmlandScene.jsx    # Three.js 3D world
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Card3D.jsx
│   │   │   │   └── CustomCursor.jsx
│   │   │   └── farmer/
│   │   │       └── FarmerLocationModal.jsx # Location module
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # JWT & session state
│   │   │   ├── LanguageContext.jsx      # EN/HI/MR i18n
│   │   │   ├── LocationContext.jsx      # GPS & Indian locations
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx            # Dual Phone/Email login
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── farmer/
│   │   │   │   ├── Home.jsx             # Dashboard
│   │   │   │   ├── SoilAnalysis.jsx     # Soil diagnostic
│   │   │   │   ├── Schemes.jsx          # Schemes & Audio Explainer
│   │   │   │   ├── ChatBot.jsx          # 2-in-1 Voice + Text AI
│   │   │   │   └── Profile.jsx
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   └── ErrorPages.jsx
│   │   ├── services/
│   │   │   └── api.js                   # Typed Axios client
│   │   ├── App.jsx
│   │   └── index.css                    # Design system
│   ├── vercel.json                      # Client SPA rewrites
│   └── package.json
│
├── server/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # MongoDB Atlas connection
│   │   ├── controllers/
│   │   │   ├── authController.js        # Phone/Email login & auth
│   │   │   ├── soilController.js        # Soil ML engine
│   │   │   ├── schemeController.js      # Scheme finder & audio explainer
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js        # JWT protect
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── SoilReport.js
│   │   │   └── Scheme.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── vercel.json                # Single-link Vercel monorepo configuration
├── README.md
└── INSTALLATION.md
```

---

## 🚀 Quick Start (Local Development)

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

In `server/`:
```bash
cp .env.example .env
```

Set environment variables in `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/krishi_seva
JWT_SECRET=your_super_secret_key_here_minimum_32_chars
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:3000
```

### 3. Run Locally

**Backend Server:**
```bash
cd server
npm start
# http://localhost:5000
```

**Frontend Client:**
```bash
cd client
npm run dev
# http://127.0.0.1:3000
```

### 4. Credentials
| Account | Phone / Email | Password |
|---|---|---|
| Farmer Demo | `9876543210` / `farmer@krishiseva.com` | `farmer123` |
| Admin Demo | `9999999999` / `admin@krishiseva.com` | `admin123` |

---

## 🌐 Production Deployment (Vercel Single-Link)

The entire fullstack project is configured for **Single-Link Vercel Deployment**:

```bash
npx vercel --prod
```

- **Live URL**: **[https://krishiseva-ai.vercel.app](https://krishiseva-ai.vercel.app)**
- **Rewrites**: All `/api/*` endpoints route to serverless `api/index.js` and client routes (`/chat`, `/schemes`, `/soil-analysis`) map to `client/dist/index.html`.

---

## 👥 Team — YCCE Hackathon 2026

**Project:** Smackathon 2026 — KrishiSeva AI Smart Farming Assistant

---

## 📄 License

MIT License — Free to use, modify and distribute with attribution.

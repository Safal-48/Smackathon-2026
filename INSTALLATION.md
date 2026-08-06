# 🗺️ Complete Installation & Setup Guide

This guide details the step-by-step setup required to run **KrishiSeva AI** locally or deploy it to a live production environment.

---

## 💻 1. Local Environment Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Version 18.x or 20.x LTS recommended)
- [Git](https://git-scm.com/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Optional, if running database locally)
- A Code Editor (e.g., VS Code)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Safal-48/Smackathon-2026.git
cd Smackathon-2026
```

### Step 2: Set Up the Server (Backend)
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Open the `.env` file and configure:
   - `PORT`: Set to `5000` (default)
   - `MONGODB_URI`: Provide your local MongoDB connection string (`mongodb://localhost:27017/krishiseva`) or MongoDB Atlas URI (see step below).
   - `JWT_SECRET`: Generate a random secret string (e.g., `supersecurejwtkeyforhackathon2026`).
   - `GEMINI_API_KEY`: Enter your Google Gemini API Key. (If empty, KrishiSeva runs using the pre-programmed offline Agri Knowledge Engine).

---

### Step 3: Set Up the Client (Frontend)
1. Open a new terminal in the project root:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```bash
   # On Windows PowerShell
   echo "VITE_API_URL=http://localhost:5000" > .env
   # On macOS/Linux/Git Bash
   echo "VITE_API_URL=http://localhost:5000" > .env
   ```
4. To verify compilation, run the production build check:
   ```bash
   npm run build
   ```

---

### Step 4: Run the Application Locally
1. Start the server (Backend terminal):
   ```bash
   cd server
   npm run dev
   ```
2. Start the client (Frontend terminal):
   ```bash
   cd client
   npm run dev -- --host 127.0.0.1 --port 3000
   ```
3. Open your browser and navigate to: `http://127.0.0.1:3000`

---

## ☁️ 2. Cloud Database Setup (MongoDB Atlas)

To configure a production database in the cloud:

1. Sign up/log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project named **KrishiSeva** and build a free Shared Cluster (M0 tier).
3. Select your provider (AWS/GCP/Azure) and choose a region close to your target audience (e.g., Mumbai, India).
4. Create a database user with access credentials (username and password).
5. In **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere (0.0.0.0/0)**. *Note: This is required for Render hosting as Render uses dynamic IPs.*
6. Go to **Database**, click **Connect**, select **Drivers**, and copy the Node.js connection string.
7. Replace the `<username>` and `<password>` placeholders in your server's `.env` file with your credentials:
   ```env
   MONGODB_URI=mongodb+srv://yourUsername:yourPassword@cluster0.abcde.mongodb.net/krishi_seva?retryWrites=true&w=majority
   ```

---

## 🌐 3. Production Deployment

Follow these steps to deploy KrishiSeva AI to production hosting.

### A. Backend Deployment (Render)
Render is an excellent platform for deploying the Node.js/Express API.

1. Create an account at [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following details:
   - **Name**: `krishiseva-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Region**: `Singapore` (closest free tier region to India)
5. Scroll down to **Advanced** -> **Environment Variables** and add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *A secure, random 32-character signing key*
   - `GEMINI_API_KEY`: *Your Google AI Studio Gemini API Key*
   - `CLIENT_URL`: `https://krishiseva.vercel.app` (replace with your actual Vercel domain once deployed)
6. Click **Create Web Service**. Wait for the build logs to finish, and copy the deployment URL (e.g., `https://krishiseva-api.onrender.com`).

---

### B. Frontend Deployment (Vercel)
Vercel is optimized for React static web deployments.

1. Go to [Vercel.com](https://vercel.com/) and sign in with your GitHub account.
2. Click **Add New** -> **Project** and import the `Smackathon-2026` repository.
3. Configure the Project:
   - **Root Directory**: Select `client`.
   - **Framework Preset**: `Vite` (auto-detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand the **Environment Variables** section and add:
   - **Key**: `VITE_API_URL`
   - **Value**: *Your Render API URL (e.g., `https://krishiseva-api.onrender.com`)*
5. Click **Deploy**. Vercel will build and assign you a production URL (e.g., `https://krishiseva.vercel.app`).
6. Update the `CLIENT_URL` environment variable in your **Render Web Service** with this new URL to allow CORS requests.

---

## 🤖 4. Gemini AI API Key Setup

To get a free Google Gemini API Key for the chatbot and soil image diagnostics:
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Log in with your Google account.
3. Click **Get API key**.
4. Click **Create API key** and select either an existing Google Cloud Project or create a new key in a new project.
5. Copy your API key and paste it as the value for `GEMINI_API_KEY` in your backend `.env` variables list.

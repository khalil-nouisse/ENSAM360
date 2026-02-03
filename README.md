# ENSAM360 - Smart Campus Project 🎓🌐

![License](https://img.shields.io/badge/license-Academic-blue.svg)
![React](https://img.shields.io/badge/frontend-React_19-61DAFB.svg?logo=react)
![Node](https://img.shields.io/badge/backend-Node.js-339933.svg?logo=node.js)
![Neo4j](https://img.shields.io/badge/database-Neo4j-008CC1.svg?logo=neo4j)
![Docker](https://img.shields.io/badge/deployment-Docker-2496ED.svg?logo=docker)

**ENSAM360** is an immersive "Smart Campus" platform designed for the École Nationale Supérieure d'Arts et Métiers (ENSAM) in Meknès. It bridges the gap between the physical and digital worlds by offering a high-fidelity **Virtual Tour**, an intelligent **AI Guide**, and a mathematically optimal **Navigation System**.

---

## 📑 Table of Contents
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Authors](#-authors)

---

## 🚀 Key Features

### 🌍 1. Immersive 360° Virtual Tour
- **High-Definition Panoramas:** Explore lecture halls, laboratories, and green spaces in full 360° VR.
- **Interactive Hotspots:** Navigate naturally between connected locations.
- **Powered by:** [Pannellum](https://pannellum.org/).

### 🗺️ 2. Interactive Navigation Engine
- **2D Vector Map:** A clickable, interactive SVG map of the entire campus.
- **Shortest Path Calculation:** Implements **Dijkstra's Algorithm** via Neo4j Graph Data Science library to find the optimal route.
- **Real-time Visualization:** Visualizes the path instantly on the 2D map using **Leaflet**.
- **Interactive Graphs:** Dynamic charts powered by **Recharts**.

![ENSAM360 2D MAP](frontend/src/assets/campus_map_2d1.svg)

### 🤖 3. The AI Brain (Chatbot)
- **Context-Aware:** Knows exactly where you are and guides you accordingly ("Turn left" vs "Go to Building B").
- **RAG Pipeline:** Uses Retrieval Augmented Generation to answer questions specific to ENSAM (Courses, Admin procedures).
- **Tech:** Powered by **Groq LPU** (Llama 3.3) and **LangChain** with **HuggingFace Embeddings**.

### 🛡️ 4. Administration & Security
- **Graph Management:** Admins can manage graph nodes and connections.
- **Secure Access:** Protected via **Passport.js**, **JWT** (JSON Web Tokens) and **OTP** email verification.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 19, Vite, TailwindCSS | Fast, responsive SPA. |
| **UI Library** | Radix UI, Lucide React | Accessible components and modern icons. |
| **Maps & Viz** | Leaflet, Recharts | Map rendering and data visualization. |
| **Backend** | Node.js, Express | RESTful API orchestrating services. |
| **Database** | Neo4j (Graph DB) | Native graph storage for optimal pathfinding ($O(1)$ hops). |
| **AI / ML** | Groq, LangChain | High-speed inference for the Chatbot. |
| **DevOps** | Docker, Docker Compose | Containerized environment for consistent deployment. |

---

## 🏗️ Architecture

The project follows a **Micro-Services** inspired architecture within a Monorepo:

![Global Architecture](docs/images/global_arch.jpg)

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Git](https://git-scm.com/) installed.
- [Node.js](https://nodejs.org/) (v18+) (if running locally).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ENSAM360.git
cd ENSAM360
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:

```env
# Backend Configuration (backend/.env)
PORT=5000

# Neo4j Database (AuraDB or Local)
NEO4J_URI=neo4j+s://your-db-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password

# AI / Chatbot
GROQ_API_KEY=gsk_...
HUGGINGFACE_API_KEY=hf_...

# Security (JWT & Email)
JWT_SECRET=your_super_secret_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

### 3. Option A: Run with Docker 🐳 (Recommended)
Launch the entire stack with a single command:

```bash
docker compose up --build
```
- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:5000`

### 3. Option B: Run Locally 💻

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```bash
ENSAM360/
├── backend/                # Node.js API
│   ├── api/
│   │   ├── controllers/    # Request logic
│   │   ├── services/       # Business logic (Map, Chatbot, Auth)
│   │   └── routes/         # API Endpoints
│   ├── config/             # DB & Env setup
│   └── scripts/            # Database Seeding scripts
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI (Map, Chatbot, Tour)
│   │   ├── pages/          # App Pages
│   │   └── context/        # Global State (Auth)
├── docs/                   # Documentation & Report
└── docker-compose.yml      # Container Orchestration
```

---

## 🔧 Troubleshooting

- **Neo4j Connection Failed:**
  - Check if your IP is whitelisted in Neo4j AuraDB.
  - Verify `NEO4J_URI`, `NEO4J_USERNAME`, and `NEO4J_PASSWORD` in `backend/.env`.

- **Chatbot Not Responding:**
  - Ensure `GROQ_API_KEY` and `HUGGINGFACE_API_KEY` are valid.
  - Check backend logs for "Quota exceeded" or connectivity errors.

---

## 👨‍💻 Authors

- **Khalil Ait Nouisse**
- **Omar Bouhlal**

---

## 📄 License
This project is an **Initiation Project** for academic purposes.

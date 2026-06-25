# ContractScan 🔍

AI-powered contract analyzer. Upload any contract (PDF, DOCX) and receive instant risk assessments, plain-English summaries, and chat with your document.

[![Live Demo](https://img.shields.io/badge/LIVE-DEMO-brightgreen?style=for-the-badge&logo=vercel&logoColor=white)](https://contractscan-frontend.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-API-blue?style=for-the-badge&logo=python&logoColor=white)](https://github.com/vigneshsai52/contractscan)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🎥 Live Demo

> **🚀 [Try ContractScan Now!](https://contractscan-frontend-three.vercel.app/)**
> *(Note: Hosted on free tier, takes ~50 seconds to wake up!)*

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Analysis** | Instantly identifies contract type, parties, key dates, financial terms, and risky clauses (High/Medium/Low) |
| 💬 **Chat with Contract** | Contextual Q&A — ask specific questions about your uploaded document and get answers based *only* on the contract text |
| 📊 **History Dashboard** | View your past 5 analyzed contracts and continue chatting with them anytime |
| 🔒 **User Auth** | Secure Sign Up & Login with JWT authentication |
| 🎨 **Modern UI** | Built with React + Tailwind CSS with a responsive, dark-mode interface |

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | AI/ML | Deployment |
|----------|---------|----------|-------|------------|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) | ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white) | ![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white) | | ![Llama_3.1](https://img.shields.io/badge/Llama_3.1-76B900?style=for-the-badge&logoColor=white) | ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black) |

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                   CONTRACTSCAN v4.0                      │
│                                                          │
│  ┌──────────────┐         ┌──────────────┐              │
│  │              │  REST   │              │──► Groq AI   │
│  │   REACT      │────────►│   FLASK      │──► SQLite    │
│  │   FRONTEND   │  API    │   BACKEND    │──► JWT Auth  │
│  │              │         │              │              │
│  └──────────────┘         └──────────────┘              │
│       VERCEL                  RENDER                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Frontend (This Repo)
```bash
git clone https://github.com/vigneshsai52/contractscan-frontend.git
cd contractscan-frontend
npm install
npm run dev
```

### Backend
Visit the [Backend Repository](https://github.com/vigneshsai52/contractscan)

---

## 🤝 Connect

Built with ❤️ by [Udayagiri Vignesh Sai](https://github.com/vigneshsai52)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/vigneshsai52)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vigneshsai52)

---

## 📝 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# ContractScan 🔍

AI-powered contract analyzer. Upload any contract (PDF, DOCX) and receive instant risk assessments, plain-English summaries, and chat with your document.

🚀 **Live Demo:** [Click Here to Try It Out!](https://contractscan-frontend-three.vercel.app/) *(Note: Hosted on free tier, takes ~50 seconds to wake up!)*

## ⚡ Features

- **AI Analysis:** Instantly identifies contract type, parties, key dates, financial terms, and risky clauses (High/Medium/Low).
- **Chat with Contract:** Contextual Q&A — ask specific questions about your uploaded document and get answers based *only* on the contract text.
- **History Dashboard:** View your past 5 analyzed contracts and continue chatting with them anytime.
- **User Auth:** Secure Sign Up & Login with JWT authentication.
- **Modern UI:** Built with React + Tailwind CSS with a responsive, dark-mode interface.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Tailwind CSS, Vite |
| **Backend** | Python, Flask, Groq AI (Llama 3.1) |
| **Database** | SQLite |
| **Authentication** | JWT (JSON Web Tokens) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## 🏗️ Architecture

```text
[ React Frontend (Vercel) ]--(REST API)-->[ Flask Backend (Render) ]
                                          |--> Groq AI (Analysis/Chat)
                                          |--> SQLite (History/Auth)
```

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

## 📝 License

MIT License — free to use and modify.

Built with ❤️ by Udayagiri Vignesh Sai

import React, { useState, useEffect, useRef, useCallback } from "react";

// ==================== STYLES & ANIMATIONS ====================
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes typing {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
    .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-spin-slow { animation: spin 2s linear infinite; }
    .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }

    .glass-card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .glass-card:hover {
      border-color: rgba(139, 92, 246, 0.3);
      box-shadow: 0 0 30px rgba(139, 92, 246, 0.15);
    }
    .gradient-text {
      background: linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .btn-gradient {
      background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
      position: relative;
      overflow: hidden;
    }
    .btn-gradient::before {
      content: "";
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    .btn-gradient:hover::before { left: 100%; }
    .mesh-bg {
      background: 
        radial-gradient(ellipse at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
        #0f172a;
    }
    .noise-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none; opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    }
    .typing-dot { animation: typing 1.4s ease-in-out infinite; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.5); }
    .drop-zone {
      border: 2px dashed rgba(139, 92, 246, 0.3);
      transition: all 0.3s ease;
    }
    .drop-zone.drag-over {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.1);
    }
  `}</style>
);

// ==================== ICONS ====================
const Icons = {
  Logo: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
      <path d="M8 12h16M8 16h12M8 20h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <defs><linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
    </svg>
  ),
  Upload: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  History: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Chat: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Zap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  FileText: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Alert: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Sparkles: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Loader: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow">
      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  ),
  Inbox: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
  Bot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
};

// ==================== API CONFIG ====================
const API_BASE_URL = "https://contractscan-backend-bstz.onrender.com";

// ==================== MAIN APP ====================
export default function App() {
  const [view, setView] = useState("landing");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);
    setEmail("");
    setView("landing");
    setHistory([]);
    setCurrentAnalysis(null);
    setChatMessages([]);
  };

  const fetchHistory = useCallback(async () => {
    if (!token) return;
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistoryError("Failed to load history. Please try again.");
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [token]);

  useEffect(() => {
    if (view === "history") {
      fetchHistory();
    }
  }, [view, fetchHistory]);

  const handleViewHistory = () => {
    setView("history");
    fetchHistory();
  };

  const handleViewChat = (historyId) => {
    setSelectedHistoryId(historyId);
    setChatMessages([]);
    setView("chat");
  };

  const handleAnalysisComplete = (analysis) => {
    setCurrentAnalysis(analysis);
    setView("results");
    fetchHistory();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans mesh-bg relative">
      <GlobalStyles />
      <div className="noise-overlay" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>
      {token && (
        <nav className="sticky top-0 z-50 glass-card border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Icons.Logo />
                <span className="text-xl font-bold tracking-tight">Contract<span className="gradient-text">Scan</span></span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <NavButton active={view === "landing"} onClick={() => setView("landing")} icon={<Icons.Upload />} label="Upload" />
                <NavButton active={view === "history"} onClick={handleViewHistory} icon={<Icons.History />} label="History" />
                <div className="h-6 w-px bg-white/10 mx-2" />
                <span className="text-sm text-slate-400 flex items-center gap-2"><Icons.User />{email}</span>
                <button onClick={handleLogout} className="ml-2 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Icons.Logout /></button>
              </div>
              <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden glass-card border-t border-white/5 p-4 animate-fade-in">
              <div className="flex flex-col gap-2">
                <MobileNavButton active={view === "landing"} onClick={() => { setView("landing"); setMobileMenuOpen(false); }} icon={<Icons.Upload />} label="Upload" />
                <MobileNavButton active={view === "history"} onClick={() => { handleViewHistory(); setMobileMenuOpen(false); }} icon={<Icons.History />} label="History" />
                <div className="pt-2 border-t border-white/10">
                  <span className="text-sm text-slate-400 flex items-center gap-2 px-3 py-2"><Icons.User />{email}</span>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Icons.Logout />Logout</button>
                </div>
              </div>
            </div>
          )}
        </nav>
      )}
      <main className="relative z-10">
        {!token ? (
          <AuthView onAuth={(t, e) => { setToken(t); setEmail(e); setView("landing"); }} />
        ) : (
          <>
            {view === "landing" && <LandingView token={token} onAnalysisComplete={handleAnalysisComplete} onViewHistory={handleViewHistory} />}
            {view === "history" && <HistoryView history={history} loading={loadingHistory} error={historyError} onRefresh={fetchHistory} onViewChat={handleViewChat} onViewAnalysis={(item) => { setCurrentAnalysis({ filename: item.filename, analysis: item.analysis, date: item.date, id: item.id }); setView("results"); }} />}
            {view === "results" && currentAnalysis && <ResultsView analysis={currentAnalysis} onBack={() => setView("landing")} onChat={() => handleViewChat(currentAnalysis.id)} />}
            {view === "chat" && selectedHistoryId && <ChatView historyId={selectedHistoryId} token={token} messages={chatMessages} setMessages={setChatMessages} input={chatInput} setInput={setChatInput} loading={chatLoading} setLoading={setChatLoading} onBack={() => setView("history")} chatEndRef={chatEndRef} />}
          </>
        )}
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
      {icon}{label}
    </button>
  );
}

function MobileNavButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
      {icon}{label}
    </button>
  );
}

// ==================== AUTH VIEW ====================
function AuthView({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Authentication failed");
      if (isLogin) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("email", data.email);
        onAuth(data.access_token, data.email);
      } else {
        setIsLogin(true);
        setError("Account created! Please login.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 mb-4 shadow-lg shadow-violet-500/25"><Icons.Logo /></div>
          <h1 className="text-3xl font-bold tracking-tight">Contract<span className="gradient-text">Scan</span></h1>
          <p className="text-slate-400 mt-2">AI-Powered Contract Analysis</p>
        </div>
        <div className="glass-card rounded-2xl p-8">
          <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-lg">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}>Login</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}>Sign Up</button>
          </div>
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${error.includes("created") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
              <Icons.Alert />{error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icons.User /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icons.Lock /></div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">{showPassword ? <Icons.EyeOff /> : <Icons.Eye />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-gradient text-white font-medium py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><Icons.Loader />Processing...</> : <>{isLogin ? <Icons.Lock /> : <Icons.User />}{isLogin ? "Login" : "Create Account"}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==================== LANDING VIEW ====================
function LandingView({ token, onAnalysisComplete, onViewHistory }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    const allowedTypes = [".pdf", ".docx", ".doc", ".txt"];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
    if (!allowedTypes.includes(ext)) { setUploadError("Please upload a PDF, DOCX, or TXT file"); return; }
    if (selectedFile.size > 10 * 1024 * 1024) { setUploadError("File size must be less than 10MB"); return; }
    setFile(selectedFile); setUploadError("");
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true); setUploadError(""); setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const progressInterval = setInterval(() => { setUploadProgress(prev => Math.min(prev + 10, 80)); }, 500);
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      clearInterval(progressInterval); setUploadProgress(100);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setTimeout(() => {
        onAnalysisComplete({ filename: data.filename, analysis: data.analysis, is_likely_contract: data.is_likely_contract, pages: data.pages, id: data.id });
        setFile(null); setUploadProgress(0); setAnalyzing(false);
      }, 500);
    } catch (err) {
      setUploadError(err.message); setAnalyzing(false); setUploadProgress(0);
    }
  };

  const features = [
    { icon: <Icons.Zap />, title: "Instant Analysis", description: "Get comprehensive contract analysis in seconds using advanced AI", color: "from-amber-500 to-orange-500" },
    { icon: <Icons.Shield />, title: "Risk Detection", description: "Identify risky clauses and potential issues before signing", color: "from-emerald-500 to-teal-500" },
    { icon: <Icons.Chat />, title: "AI Chat Support", description: "Ask questions about your contract and get instant answers", color: "from-violet-500 to-purple-500" },
    { icon: <Icons.FileText />, title: "Plain English", description: "Complex legal terms translated into simple, understandable language", color: "from-pink-500 to-rose-500" }
  ];

  const stats = [
    { value: "10x", label: "Faster Analysis", icon: <Icons.Zap /> },
    { value: "99%", label: "Accuracy Rate", icon: <Icons.Check /> },
    { value: "24/7", label: "AI Support", icon: <Icons.Clock /> },
    { value: "50K+", label: "Contracts Scanned", icon: <Icons.FileText /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6"><Icons.Sparkles />Powered by Advanced AI</div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Understand Your <span className="gradient-text">Contracts</span><br />in Seconds</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">Upload any contract and get instant AI-powered analysis, risk detection, and plain English summaries. No legal expertise required.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => document.getElementById("upload-section").scrollIntoView({ behavior: "smooth" })} className="btn-gradient text-white font-medium px-8 py-4 rounded-xl text-lg hover:shadow-xl hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"><Icons.Upload />Analyze Contract</button>
          <button onClick={onViewHistory} className="px-8 py-4 rounded-xl text-lg font-medium border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all flex items-center justify-center gap-2"><Icons.History />View History</button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        {stats.map((stat, index) => (
          <div key={index} className="glass-card rounded-xl p-6 text-center hover:border-violet-500/30 transition-all">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 mb-3">{stat.icon}</div>
            <div className="text-2xl font-bold gradient-text">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>
      <div id="upload-section" className="max-w-2xl mx-auto mb-16">
        <div className="glass-card rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-2xl font-bold mb-2 text-center">Upload Your Contract</h2>
          <p className="text-slate-400 text-center mb-6">Drag and drop or click to select a file</p>
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`drop-zone rounded-xl p-12 text-center cursor-pointer transition-all ${dragOver ? "drag-over" : ""} ${file ? "border-emerald-500/50 bg-emerald-500/5" : ""}`}>
            <input ref={fileInputRef} type="file" onChange={handleFileSelect} accept=".pdf,.docx,.doc,.txt" className="hidden" />
            {file ? (
              <div className="animate-scale-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-4"><Icons.Check /></div>
                <p className="text-lg font-medium text-white">{file.name}</p>
                <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 text-violet-400 mb-4"><Icons.Upload /></div>
                <p className="text-lg font-medium text-white mb-2">Drop your contract here</p>
                <p className="text-sm text-slate-400">Supports PDF, DOCX, and TXT files</p>
              </>
            )}
          </div>
          {uploadError && <div className="mt-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm flex items-center gap-2 animate-fade-in"><Icons.Alert />{uploadError}</div>}
          {analyzing && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-2"><span>Analyzing contract...</span><span>{uploadProgress}%</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${uploadProgress}%` }} /></div>
            </div>
          )}
          {file && !analyzing && (
            <button onClick={handleAnalyze} className="w-full mt-6 btn-gradient text-white font-medium py-3 rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2 animate-fade-in"><Icons.Sparkles />Analyze Contract</button>
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="glass-card rounded-xl p-6 hover:border-violet-500/30 transition-all group animate-fade-in-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}><div className="text-white">{feature.icon}</div></div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[{ step: "1", title: "Upload", desc: "Upload any PDF, DOCX, or TXT contract file" }, { step: "2", title: "Analyze", desc: "Our AI analyzes every clause and identifies risks" }, { step: "3", title: "Understand", desc: "Get a clear summary and ask follow-up questions" }].map((item, index) => (
            <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${0.6 + index * 0.15}s` }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-500/20 text-violet-400 text-xl font-bold mb-4">{item.step}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="text-center text-slate-500 text-sm py-8"><p> ContractScan AI. All rights reserved.</p></footer>
    </div>
  );
}

// ==================== HISTORY VIEW ====================
function HistoryView({ history, loading, error, onRefresh, onViewChat, onViewAnalysis }) {
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="glass-card rounded-2xl p-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 text-violet-400 mb-4 animate-pulse"><Icons.Loader /></div>
          <p className="text-lg text-slate-400">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-400 mb-4"><Icons.Alert /></div>
          <p className="text-lg text-red-400 mb-4">{error}</p>
          <button onClick={onRefresh} className="btn-gradient text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"><Icons.Loader />Try Again</button>
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-card rounded-2xl p-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 text-slate-600 mb-6"><Icons.Inbox /></div>
          <h2 className="text-2xl font-bold mb-2">No History Yet</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">You haven't analyzed any contracts yet. Upload your first contract to see it here.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="btn-gradient text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"><Icons.Upload />Analyze Your First Contract</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Analysis History</h2>
          <p className="text-slate-400 mt-1">Your previously analyzed contracts</p>
        </div>
        <button onClick={onRefresh} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all" title="Refresh history"><Icons.Loader /></button>
      </div>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={item.id || index} className="glass-card rounded-xl p-6 hover:border-violet-500/30 transition-all group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400"><Icons.FileText /></div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">{item.filename}</h3>
                    <p className="text-sm text-slate-400">{new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-400 line-clamp-2">{item.analysis?.substring(0, 150)}...</div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => onViewAnalysis(item)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all" title="View Analysis"><Icons.Eye /></button>
                <button onClick={() => onViewChat(item.id)} className="p-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all" title="Chat about this contract"><Icons.Chat /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== RESULTS VIEW ====================
function ResultsView({ analysis, onBack, onChat }) {
  const renderAnalysis = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith("📋") || trimmed.startsWith("👥") || trimmed.startsWith("📅") || trimmed.startsWith("💰") || trimmed.startsWith("⚠️") || trimmed.startsWith("❓") || trimmed.startsWith("📝")) {
        return <h3 key={index} className="text-lg font-semibold text-violet-300 mt-6 mb-3 flex items-center gap-2">{trimmed}</h3>;
      }
      if (trimmed.toLowerCase().includes("high risk") || trimmed.toLowerCase().includes("high")) {
        return <div key={index} className="flex items-start gap-2 text-red-400 mb-2"><span className="mt-1"><Icons.Alert /></span><span>{trimmed}</span></div>;
      }
      if (trimmed.toLowerCase().includes("medium risk") || trimmed.toLowerCase().includes("medium")) {
        return <div key={index} className="flex items-start gap-2 text-amber-400 mb-2"><span className="mt-1"><Icons.Alert /></span><span>{trimmed}</span></div>;
      }
      if (trimmed.toLowerCase().includes("low risk") || trimmed.toLowerCase().includes("low")) {
        return <div key={index} className="flex items-start gap-2 text-emerald-400 mb-2"><span className="mt-1"><Icons.Check /></span><span>{trimmed}</span></div>;
      }
      if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
        return <li key={index} className="ml-4 text-slate-300 mb-1 flex items-start gap-2"><span className="text-violet-400 mt-1">•</span><span>{trimmed.substring(1).trim()}</span></li>;
      }
      return <p key={index} className="text-slate-300 mb-2 leading-relaxed">{trimmed}</p>;
    }).filter(Boolean);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"><Icons.ChevronLeft /></button>
        <div>
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          <p className="text-slate-400">{analysis.filename}</p>
        </div>
      </div>
      <div className="glass-card rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center"><Icons.Sparkles /></div>
          <div>
            <h3 className="font-semibold">AI Analysis Complete</h3>
            <p className="text-sm text-slate-400">{analysis.date ? new Date(analysis.date).toLocaleString() : "Just now"}</p>
          </div>
        </div>
        <div className="prose prose-invert max-w-none">{renderAnalysis(analysis.analysis)}</div>
      </div>
      <div className="flex gap-4">
        <button onClick={onBack} className="flex-1 py-3 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all flex items-center justify-center gap-2"><Icons.Upload />Analyze Another</button>
        {analysis.id && <button onClick={onChat} className="flex-1 btn-gradient text-white py-3 rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"><Icons.Chat />Ask Questions</button>}
      </div>
    </div>
  );
}

// ==================== CHAT VIEW ====================
function ChatView({ historyId, token, messages, setMessages, input, setInput, loading, setLoading, onBack, chatEndRef }) {
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ history_id: historyId, question: userMessage })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to get response");
      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"><Icons.ChevronLeft /></button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Contract AI Assistant</span>
        </div>
      </div>
      <div className="flex-1 glass-card rounded-2xl p-6 overflow-y-auto custom-scrollbar mb-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 text-violet-400 mb-4"><Icons.Bot /></div>
            <p>Ask me anything about this contract!</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === "user" ? "bg-violet-600 text-white rounded-br-md" : "bg-slate-800 text-slate-200 rounded-bl-md"}`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-slate-800 rounded-2xl rounded-bl-md px-5 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-violet-400 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-violet-400 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-violet-400 typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this contract..."
          className="flex-1 px-5 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} className="px-5 py-3 btn-gradient text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <Icons.Send />
        </button>
      </form>
    </div>
  );
}

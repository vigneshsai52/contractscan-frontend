import { useState, useEffect, useRef } from 'react';

// ─── INLINE CSS FOR ANIMATIONS & KEYFRAMES ───
const globalStyles = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes typingBounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
.animate-slide-in-right {
  animation: slideInRight 0.5s ease-out forwards;
}
.animate-pulse-glow {
  animation: pulseGlow 6s ease-in-out infinite;
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
.animate-spin-slow {
  animation: spin 1s linear infinite;
}
.typing-dot {
  animation: typingBounce 1.4s ease-in-out infinite both;
}
.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gradient-text-hero {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #c2e9fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gradient-text-accent {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.glass-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.glow-button {
  position: relative;
  overflow: hidden;
}
.glow-button::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}
.glow-button:hover::before {
  left: 100%;
}

.hero-gradient-bg {
  background: radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 50%),
              #0f172a;
}

.mesh-gradient {
  background: 
    radial-gradient(at 40% 20%, hsla(266,59%,49%,0.3) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(189,100%,56%,0.2) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(340,100%,76%,0.2) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsla(266,59%,49%,0.2) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(189,100%,56%,0.2) 0px, transparent 50%),
    #0f172a;
}

.grid-pattern {
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.noise-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
`;

// ─── ICONS ───
const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="10" fill="url(#logoGrad)" />
    <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
    </defs>
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

// ─── REUSABLE COMPONENTS ───
const Navbar = ({ token, onNavigate, onLogout, activeView }) => (
  <nav className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0f172a]/80">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('landing')}>
        <div className="group-hover:scale-110 transition-transform duration-300">
          <Logo />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">ContractScan</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onNavigate('analyze')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeView === 'analyze' 
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <SparkleIcon /> Analyze
        </button>
        <button 
          onClick={() => onNavigate('history')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeView === 'history' || activeView === 'chat'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HistoryIcon /> History
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 ml-2"
        >
          <LogoutIcon /> Logout
        </button>
      </div>
    </div>
  </nav>
);

const GlowButton = ({ children, onClick, disabled, variant = 'primary', className = '', type = 'button' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white glow-button hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5',
    danger: 'bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 hover:-translate-y-0.5',
    ghost: 'text-slate-400 hover:text-white'
  };
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <div className={`glass-card rounded-2xl p-6 transition-all duration-500 ${hover ? 'hover:scale-[1.02]' : ''} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    pink: 'bg-pink-500/10 text-pink-300 border-pink-500/20'
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-1.5 items-center px-4 py-3">
    <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
    <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
    <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
  </div>
);

// ─── MAIN APP ───
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [view, setView] = useState('landing');
  const [historyList, setHistoryList] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);

  const chatEndRef = useRef(null);

  const API_URL = 'https://contractscan-backend-bstz.onrender.com';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const navigateTo = (newView) => {
    setPageTransition(true);
    setTimeout(() => {
      setView(newView);
      setPageTransition(false);
    }, 200);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setAuthLoading(true);

    const endpoint = isLogin ? '/login' : '/signup';
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
      } else if (data.message) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMessage(null);
        }, 2000);
      }
    } catch (err) {
      setError('Failed to connect. The server might be waking up (takes ~50 seconds). Please wait and try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setResult(null);
    setView('landing');
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId); 

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Server is waking up or AI is processing. Please try again in 30 seconds.');
      } else {
        setError('Failed to connect to the AI server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setHistoryList(data);
      navigateTo('history');
    } catch (err) {
      setError('Failed to load history.');
    }
  };

  const openChat = (item) => {
    setSelectedHistory(item);
    setChatMessages([{ role: 'assistant', text: `Hi! I'm your AI contract analyst. Ask me anything about **${item.filename}** — I'll help you understand the terms, risks, and key clauses.` }]);
    navigateTo('chat');
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ history_id: selectedHistory.id, question: userMsg })
      });

      const data = await response.json();
      if (data.error) {
        setChatMessages(prev => [...prev, { role: 'assistant', text: `Error: ${data.error}` }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Failed to connect to the AI server. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  // ─── AUTH SCREEN ───
  if (!token) {
    return (
      <div className="min-h-screen text-white relative overflow-hidden mesh-gradient">
        <style>{globalStyles}</style>
        <div className="noise-overlay" />

        {/* Floating orbs */}
        <div className="fixed top-20 left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="fixed bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />

        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className={`w-full max-w-md transition-all duration-500 ${pageTransition ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <Card className="p-8" hover={false}>
              <div className="flex items-center justify-center gap-3 mb-8">
                <Logo />
                <span className="text-2xl font-bold text-white">ContractScan</span>
              </div>

              <h2 className="text-3xl font-bold text-center mb-2">
                {isLogin ? "Welcome back" : "Get started"}
              </h2>
              <p className="text-slate-400 text-center text-sm mb-8">
                {isLogin ? "Sign in to your AI contract analyst" : "Create your free account today"}
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                  <WarningIcon />
                  <span>{error}</span>
                </div>
              )}
              {successMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl mb-6 text-sm flex items-start gap-3 animate-pulse">
                  <CheckIcon />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email address</label>
                  <input 
                    type="email" 
                    placeholder="you@company.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50" 
                    required 
                    disabled={authLoading || !!successMessage} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50" 
                    required 
                    disabled={authLoading || !!successMessage} 
                  />
                </div>

                <GlowButton type="submit" disabled={authLoading || !!successMessage} className="w-full mt-2 py-3.5">
                  {authLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                      Processing...
                    </span>
                  ) : (
                    isLogin ? "Sign In" : "Create Account"
                  )}
                </GlowButton>
              </form>

              <p className="mt-6 text-center text-slate-400 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMessage(null); }} 
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors" 
                  disabled={authLoading}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ─── LANDING PAGE ───
  if (view === 'landing') {
    return (
      <div className="min-h-screen text-white relative overflow-hidden mesh-gradient">
        <style>{globalStyles}</style>
        <div className="noise-overlay" />
        <div className="grid-pattern fixed inset-0 pointer-events-none" />

        {/* Floating orbs */}
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/8 rounded-full blur-[150px]" />

        <Navbar token={token} onNavigate={navigateTo} onLogout={handleLogout} activeView={view} />

        <div className={`max-w-7xl mx-auto px-6 py-20 relative z-10 transition-all duration-500 ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {/* Hero */}
          <div className="text-center mb-24 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <SparkleIcon /> AI-Powered Contract Analysis
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
              <span className="text-white">Understand Your</span>
              <br />
              <span className="gradient-text-accent">Contracts in Seconds</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Upload any contract and let our AI identify risks, summarize terms, and answer your questions — all in one place.
            </p>

            <div className="flex items-center justify-center gap-4">
              <GlowButton onClick={() => navigateTo('analyze')} className="flex items-center gap-2 px-8 py-4 text-base">
                <UploadIcon /> Upload Contract
              </GlowButton>
              <GlowButton variant="secondary" onClick={fetchHistory} className="flex items-center gap-2 px-8 py-4 text-base">
                <HistoryIcon /> View History
              </GlowButton>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            <Card className="group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <SparkleIcon />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Analysis</h3>
              <p className="text-slate-400 leading-relaxed">Our advanced AI reads and understands complex legal language, extracting key terms and identifying potential risks automatically.</p>
            </Card>

            <Card className="group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <ShieldIcon />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Risk Detection</h3>
              <p className="text-slate-400 leading-relaxed">Spot hidden clauses, unfair terms, and potential liabilities before you sign. Protect yourself with intelligent contract review.</p>
            </Card>

            <Card className="group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <ZapIcon />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Q&A</h3>
              <p className="text-slate-400 leading-relaxed">Chat with your contract. Ask questions in plain English and get clear, contextual answers about any clause or term.</p>
            </Card>
          </div>

          {/* Stats Bar */}
          <Card className="p-10" hover={false}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-5xl font-bold gradient-text mb-2">10x</div>
                <div className="text-slate-400 text-sm uppercase tracking-wider">Faster Review</div>
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-5xl font-bold gradient-text mb-2">99%</div>
                <div className="text-slate-400 text-sm uppercase tracking-wider">Detection Accuracy</div>
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-5xl font-bold gradient-text mb-2">24/7</div>
                <div className="text-slate-400 text-sm uppercase tracking-wider">Always Available</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ─── ANALYZE VIEW ───
  if (view === 'analyze') {
    return (
      <div className="min-h-screen text-white relative overflow-hidden mesh-gradient">
        <style>{globalStyles}</style>
        <div className="noise-overlay" />

        <Navbar token={token} onNavigate={navigateTo} onLogout={handleLogout} activeView={view} />

        <div className={`max-w-4xl mx-auto px-6 py-12 relative z-10 transition-all duration-500 ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-3">Upload Your Contract</h1>
            <p className="text-slate-400 text-lg">Drag and drop or click to upload a PDF, DOCX, or TXT file</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 text-sm flex items-start gap-3 animate-fade-in">
              <WarningIcon />
              <span>{error}</span>
            </div>
          )}

          <Card className="p-8 mb-8 animate-fade-in-up" hover={false}>
            <div 
              className={`border-2 border-dashed rounded-2xl p-14 text-center transition-all duration-300 cursor-pointer ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
                  : file 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="file-upload" />

              {file ? (
                <div className="animate-fade-in">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <DocumentIcon />
                  </div>
                  <p className="text-2xl font-bold text-emerald-400 mb-2">{file.name}</p>
                  <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB • Click to change file</p>
                </div>
              ) : (
                <div>
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <ArrowUpIcon />
                  </div>
                  <p className="text-2xl font-bold mb-2">Drop your contract here</p>
                  <p className="text-sm text-slate-400">or click to browse • PDF, DOCX, DOC, TXT</p>
                </div>
              )}
            </div>

            <GlowButton 
              onClick={handleAnalyze} 
              disabled={!file || loading} 
              className="w-full mt-8 py-4 text-base flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <SparkleIcon /> Analyze Contract
                </>
              )}
            </GlowButton>
          </Card>

          {result && (
            <div className="animate-fade-in-up">
              <Card className="p-8" hover={false}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.is_likely_contract ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                    {result.is_likely_contract ? <CheckIcon /> : <WarningIcon />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Analysis Complete</h2>
                    <p className="text-slate-400 text-sm">
                      {result.is_likely_contract ? 'Contract detected and analyzed' : 'May not be a standard contract'}
                    </p>
                  </div>
                  <div className="ml-auto">
                    {result.is_likely_contract ? (
                      <Badge color="emerald"><CheckIcon /> Contract Detected</Badge>
                    ) : (
                      <Badge color="amber"><WarningIcon /> Review Needed</Badge>
                    )}
                  </div>
                </div>

                <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm font-mono">
                    {result.analysis ? result.analysis : "No text could be extracted. Try a text-based PDF or DOCX."}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── HISTORY VIEW ───
  if (view === 'history') {
    return (
      <div className="min-h-screen text-white relative overflow-hidden mesh-gradient">
        <style>{globalStyles}</style>
        <div className="noise-overlay" />

        <Navbar token={token} onNavigate={navigateTo} onLogout={handleLogout} activeView={view} />

        <div className={`max-w-4xl mx-auto px-6 py-12 relative z-10 transition-all duration-500 ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-3">Analysis History</h1>
            <p className="text-slate-400 text-lg">Review and chat with your previously analyzed contracts</p>
          </div>

          {historyList.length === 0 ? (
            <Card className="p-16 text-center" hover={false}>
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-slate-500">
                <HistoryIcon />
              </div>
              <h3 className="text-2xl font-bold mb-3">No history yet</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Upload a contract to get started with AI-powered analysis and intelligent risk detection.</p>
              <GlowButton onClick={() => navigateTo('analyze')} className="flex items-center gap-2 mx-auto">
                <SparkleIcon /> Analyze First Contract
              </GlowButton>
            </Card>
          ) : (
            <div className="space-y-4">
              {historyList.map((item, idx) => (
                <Card key={item.id} className="flex items-center justify-between group animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-all duration-300">
                      <DocumentIcon />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{item.filename}</h3>
                      <p className="text-slate-400 text-sm">{new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <GlowButton 
                      variant="secondary" 
                      onClick={() => { setResult({analysis: item.analysis, is_likely_contract: true}); setView('analyze'); }}
                      className="flex items-center gap-2"
                    >
                      <FileTextIcon /> View
                    </GlowButton>
                    <GlowButton 
                      onClick={() => openChat(item)}
                      className="flex items-center gap-2"
                    >
                      <BotIcon /> Chat
                    </GlowButton>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── CHAT VIEW ───
  if (view === 'chat' && selectedHistory) {
    return (
      <div className="min-h-screen text-white relative overflow-hidden flex flex-col mesh-gradient">
        <style>{globalStyles}</style>
        <div className="noise-overlay" />

        <Navbar token={token} onNavigate={navigateTo} onLogout={handleLogout} activeView={view} />

        <div className={`flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col relative z-10 transition-all duration-500 ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <DocumentIcon />
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedHistory.filename}</h2>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  AI Contract Assistant Online
                </p>
              </div>
            </div>
            <GlowButton variant="secondary" onClick={() => navigateTo('history')} className="flex items-center gap-2">
              <ChevronLeftIcon /> Back
            </GlowButton>
          </div>

          <Card className="flex-1 flex flex-col min-h-[500px] mb-6" hover={false}>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                        : 'bg-white/5 border border-white/10 text-slate-400'
                    }`}>
                      {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm' 
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                    }`}>
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                    </div>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center flex-shrink-0">
                      <BotIcon />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/5 flex gap-3">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="Ask about this contract..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3.5 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                disabled={chatLoading}
              />
              <GlowButton type="submit" disabled={chatLoading || !chatInput.trim()} className="flex items-center gap-2 px-6">
                <SendIcon /> Send
              </GlowButton>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}

export default App;

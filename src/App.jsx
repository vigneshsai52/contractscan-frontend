import { useState, useEffect, useRef } from 'react';

// ─── INLINE CSS ANIMATIONS (no tailwindcss-animate plugin needed) ───
const animationStyles = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulse-glow {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes bounce-dot {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
.animate-pulse-glow {
  animation: pulse-glow 4s ease-in-out infinite;
}
.animate-spin-slow {
  animation: spin-slow 1s linear infinite;
}
.bounce-dot {
  animation: bounce-dot 1.4s ease-in-out infinite both;
}
`;

// ─── ICONS (inline SVG, zero dependencies) ───
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
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
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

// ─── ANIMATED BACKGROUND ───
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-glow" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-[#050810]" />
  </div>
);

// ─── GLOWING BUTTON ───
const GlowButton = ({ children, onClick, disabled, variant = 'primary', className = '', type = 'button' }) => {
  const base = "relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-slate-800/80 text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-700/80 hover:-translate-y-0.5 active:translate-y-0",
    danger: "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 hover:-translate-y-0.5",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// ─── GLASS CARD ───
const GlassCard = ({ children, className = '', hover = true }) => (
  <div className={`bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl ${hover ? 'hover:border-slate-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500' : ''} ${className}`}>
    {children}
  </div>
);

// ─── TYPING INDICATOR ───
const TypingIndicator = () => (
  <div className="flex gap-1.5 items-center px-4 py-3">
    <div className="w-2 h-2 bg-slate-400 rounded-full bounce-dot" />
    <div className="w-2 h-2 bg-slate-400 rounded-full bounce-dot" style={{ animationDelay: '0.15s' }} />
    <div className="w-2 h-2 bg-slate-400 rounded-full bounce-dot" style={{ animationDelay: '0.3s' }} />
  </div>
);

// ─── FEATURE CARD ───
const FeatureCard = ({ icon, title, description }) => (
  <GlassCard className="p-6 group">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </GlassCard>
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
      <div className="min-h-screen text-white relative overflow-hidden">
        <style>{animationStyles}</style>
        <AnimatedBackground />

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className={`w-full max-w-md transition-all duration-500 ${pageTransition ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <GlassCard className="p-8" hover={false}>
              <div className="flex items-center justify-center gap-3 mb-8">
                <Logo />
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">ContractScan</span>
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-slate-400 text-center text-sm mb-8">
                {isLogin ? "Sign in to analyze your contracts with AI" : "Start your AI-powered contract analysis journey"}
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
                  <label className="text-sm font-medium text-slate-300">Email</label>
                  <input 
                    type="email" 
                    placeholder="you@company.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all disabled:opacity-50" 
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
                    className="w-full p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all disabled:opacity-50" 
                    required 
                    disabled={authLoading || !!successMessage} 
                  />
                </div>

                <GlowButton type="submit" disabled={authLoading || !!successMessage} className="w-full mt-2">
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
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  // ─── LANDING PAGE ───
  if (view === 'landing') {
    return (
      <div className="min-h-screen text-white relative overflow-hidden">
        <style>{animationStyles}</style>
        <AnimatedBackground />

        <nav className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">ContractScan</span>
            </div>
            <div className="flex items-center gap-3">
              <GlowButton variant="ghost" onClick={() => navigateTo('analyze')} className="flex items-center gap-2">
                <SparkleIcon /> Analyze
              </GlowButton>
              <GlowButton variant="ghost" onClick={fetchHistory} className="flex items-center gap-2">
                <HistoryIcon /> History
              </GlowButton>
              <GlowButton variant="danger" onClick={handleLogout} className="flex items-center gap-2">
                <LogoutIcon /> Logout
              </GlowButton>
            </div>
          </div>
        </nav>

        <div className={`max-w-6xl mx-auto px-6 py-20 transition-all duration-500 ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <SparkleIcon /> AI-Powered Contract Analysis
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Understand Your</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Contracts in Seconds</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
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

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <FeatureCard 
              icon={<SparkleIcon />}
              title="AI-Powered Analysis"
              description="Our advanced AI reads and understands complex legal language, extracting key terms and identifying potential risks automatically."
            />
            <FeatureCard 
              icon={<ShieldIcon />}
              title="Risk Detection"
              description="Spot hidden clauses, unfair terms, and potential liabilities before you sign. Protect yourself with intelligent contract review."
            />
            <FeatureCard 
              icon={<ZapIcon />}
              title="Instant Q&A"
              description="Chat with your contract. Ask questions in plain English and get clear, contextual answers about any clause or term."
            />
          </div>

          <GlassCard className="p-8" hover={false}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-indigo-400 mb-2">10x</div>
                <div className="text-slate-400 text-sm">Faster than manual review</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">99%</div>
                <div className="text-slate-400 text-sm">Clause detection accuracy</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-400 mb-2">24/7</div>
                <div className="text-slate-400 text-sm">Available anytime</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // ─── ANALYZE VIEW ───
  if (view === 'analyze') {
    return (
      <div className="min-h-screen text-white relative overflow-hidden">
        <style>{animationStyles}</style>
        <AnimatedBackground />

        <nav className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('landing')}>
              <Logo />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">ContractScan</span>
            </div>
            <div className="flex items-center gap-3">
              <GlowButton variant="ghost" onClick={() => navigateTo('analyze')} className="flex items-center gap-2 text-indigo-400">
                <SparkleIcon /> Analyze
              </GlowButton>
              <GlowButton variant="ghost" onClick={fetchHistory} className="flex items-center gap-2">
                <HistoryIcon /> History
              </GlowButton>
              <GlowButton variant="danger" onClick={handleLogout} className="flex items-center gap-2">
                <LogoutIcon /> Logout
              </GlowButton>
            </div>
          </div>
        </nav>

        <div className={`max-w-4xl mx-auto px-6 py-12 transition-all duration-500 ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Your Contract</h1>
            <p className="text-slate-400">Drag and drop or click to upload a PDF, DOCX, or TXT file</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <WarningIcon />
              <span>{error}</span>
            </div>
          )}

          <GlassCard className="p-8 mb-8">
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
                  : file 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="file-upload" />

              {file ? (
                <div className="animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <FileTextIcon />
                  </div>
                  <p className="text-xl font-semibold text-emerald-400 mb-2">{file.name}</p>
                  <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB • Click to change file</p>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <UploadIcon />
                  </div>
                  <p className="text-xl font-semibold mb-2">Drop your contract here</p>
                  <p className="text-sm text-slate-400">or click to browse • PDF, DOCX, DOC, TXT</p>
                </div>
              )}
            </div>

            <GlowButton 
              onClick={handleAnalyze} 
              disabled={!file || loading} 
              className="w-full mt-6 py-4 text-base flex items-center justify-center gap-3"
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
          </GlassCard>

          {result && (
            <div className="animate-fade-in-up">
              <GlassCard className="p-8" hover={false}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.is_likely_contract ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
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
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-4 py-2 rounded-full">
                        Contract Detected
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-4 py-2 rounded-full">
                        Review Needed
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm font-mono">
                    {result.analysis ? result.analysis : "No text could be extracted. Try a text-based PDF or DOCX."}
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── HISTORY VIEW ───
  if (view === 'history') {
    return (
      <div className="min-h-screen text-white relative overflow-hidden">
        <style>{animationStyles}</style>
        <AnimatedBackground />

        <nav className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('landing')}>
              <Logo />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">ContractScan</span>
            </div>
            <div className="flex items-center gap-3">
              <GlowButton variant="ghost" onClick={() => navigateTo('analyze')} className="flex items-center gap-2">
                <SparkleIcon /> Analyze
              </GlowButton>
              <GlowButton variant="ghost" onClick={fetchHistory} className="flex items-center gap-2 text-indigo-400">
                <HistoryIcon /> History
              </GlowButton>
              <GlowButton variant="danger" onClick={handleLogout} className="flex items-center gap-2">
                <LogoutIcon /> Logout
              </GlowButton>
            </div>
          </div>
        </nav>

        <div className={`max-w-4xl mx-auto px-6 py-12 transition-all duration-500 ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
            <p className="text-slate-400">Review and chat with your previously analyzed contracts</p>
          </div>

          {historyList.length === 0 ? (
            <GlassCard className="p-12 text-center" hover={false}>
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
                <HistoryIcon />
              </div>
              <h3 className="text-xl font-semibold mb-2">No history yet</h3>
              <p className="text-slate-400 mb-6">Upload a contract to get started with AI analysis</p>
              <GlowButton onClick={() => navigateTo('analyze')} className="flex items-center gap-2 mx-auto">
                <SparkleIcon /> Analyze First Contract
              </GlowButton>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {historyList.map(item => (
                <GlassCard key={item.id} className="p-6 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <FileTextIcon />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-indigo-300 transition-colors">{item.filename}</h3>
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
                </GlassCard>
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
      <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
        <style>{animationStyles}</style>
        <AnimatedBackground />

        <nav className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('landing')}>
              <Logo />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">ContractScan</span>
            </div>
            <div className="flex items-center gap-3">
              <GlowButton variant="ghost" onClick={() => navigateTo('analyze')} className="flex items-center gap-2">
                <SparkleIcon /> Analyze
              </GlowButton>
              <GlowButton variant="ghost" onClick={fetchHistory} className="flex items-center gap-2">
                <HistoryIcon /> History
              </GlowButton>
              <GlowButton variant="danger" onClick={handleLogout} className="flex items-center gap-2">
                <LogoutIcon /> Logout
              </GlowButton>
            </div>
          </div>
        </nav>

        <div className={`flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col transition-all duration-500 ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileTextIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold">{selectedHistory.filename}</h2>
                <p className="text-slate-400 text-sm">AI Contract Assistant</p>
              </div>
            </div>
            <GlowButton variant="secondary" onClick={() => navigateTo('history')} className="flex items-center gap-2">
              <ArrowRightIcon /> Back to History
            </GlowButton>
          </div>

          <GlassCard className="flex-1 flex flex-col min-h-[500px] mb-6" hover={false}>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
                    }`}>
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                    </div>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0">
                      <BotIcon />
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 border-t border-slate-700/50 flex gap-3">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="Ask about this contract..." 
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                disabled={chatLoading}
              />
              <GlowButton type="submit" disabled={chatLoading || !chatInput.trim()} className="flex items-center gap-2 px-6">
                <SendIcon /> Send
              </GlowButton>
            </form>
          </GlassCard>
        </div>
      </div>
    );
  }

  return null;
}

export default App;

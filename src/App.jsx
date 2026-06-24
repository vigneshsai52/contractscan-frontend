import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    
    const endpoint = isLogin ? '/login' : '/signup';
    try {
      const response = await fetch(`https://documind-ai-production-ce16.up.railway.app${endpoint}`, {
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
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // --- TIMEOUT FIX: Wait up to 30 seconds for the server to wake up ---
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); 

      const response = await fetch('https://documind-ai-production-ce16.up.railway.app/analyze', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
        signal: controller.signal // Added this line
      });
      
      clearTimeout(timeoutId); // Clear the timer if it connects successfully
      // ----------------------------------------------------------------------

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Server is waking up. Please try again in 10 seconds.');
      } else {
        setError('Failed to connect to the AI server.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
            {isLogin ? "Login to ContractScan" : "Create Account"}
          </h2>
          
          {error && <p className="text-red-400 mb-4 text-center text-sm">{error}</p>}
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition-colors"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-blue-400 hover:underline">
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white flex flex-col items-center p-8">
      <div className="max-w-3xl w-full">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              ContractScan 🔍
            </h1>
            <p className="text-gray-400 text-lg">AI-powered contract analysis</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-sm">
            Logout
          </button>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 mb-6">
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-10 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-xl font-semibold mb-2">
                {file ? file.name : "Click to Upload Contract"}
              </p>
              <p className="text-sm text-gray-400">PDF, DOCX, DOC, or TXT</p>
            </label>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? '⏳ Analyzing with AI...' : '🔍 Analyze Contract'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-6 rounded-2xl mb-6">
            <p className="font-bold text-lg mb-1">❌ Error</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-green-400">✅ Analysis Complete</h2>
              {result.is_likely_contract ? (
                 <span className="bg-green-600 text-xs font-bold px-3 py-1 rounded-full">Contract Detected</span>
              ) : (
                 <span className="bg-yellow-600 text-xs font-bold px-3 py-1 rounded-full">May not be a contract</span>
              )}
            </div>
            <div className="bg-gray-900 p-6 rounded-xl text-gray-300 whitespace-pre-wrap leading-relaxed font-mono text-sm border border-gray-700">
              {result.analysis}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
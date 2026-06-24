import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Connecting to your existing Flask Backend on Railway!
      const response = await fetch('https://documind-ai-production-ce16.up.railway.app/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to connect to the AI server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white flex flex-col items-center p-8">
      <div className="max-w-3xl w-full">
        
        {/* Header */}
        <h1 className="text-5xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          ContractScan 🔍
        </h1>
        <p className="text-gray-400 text-center mb-10 text-lg">
          AI-powered contract analysis. Know what you're signing.
        </p>

        {/* Upload Card */}
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-6 rounded-2xl mb-6">
            <p className="font-bold text-lg mb-1">❌ Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Result Display */}
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
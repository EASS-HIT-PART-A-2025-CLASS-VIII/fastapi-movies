import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Send, Loader2 } from 'lucide-react';
import apiClient from '../api/client';

export const AIAdvisor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAdvice(null);

    try {
      const response = await apiClient.get('/ai/advice', {
        params: { query },
      });
      setAdvice(response.data.advice);
    } catch (err) {
      setAdvice(
        "I'm having trouble connecting to my brain right now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center">
        <div className="inline-flex p-3 bg-[#238636]/10 rounded-2xl mb-4">
          <BrainCircuit className="text-[#238636]" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white">AI Financial Intelligence</h1>
        <p className="text-[#8b949e] mt-2">
          Get personalized insights based on your spending patterns.
        </p>
      </header>

      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl">
        <div className="space-y-4">
          <label className="text-sm font-medium text-[#8b949e] flex items-center gap-2 px-1">
            <Sparkles size={14} /> Ask anything about your finances
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., How can I save more on groceries next month?"
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl min-h-[120px] p-4 focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none transition-all text-white resize-none"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !query.trim()}
            className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:hover:bg-[#238636] text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={18} /> Get Advice
              </>
            )}
          </button>
        </div>

        {advice && (
          <div className="mt-8 p-6 bg-[#0d1117] border-l-4 border-[#238636] rounded-r-xl animate-in zoom-in-95 duration-300">
            <h4 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest mb-3">
              Advisor Insight
            </h4>
            <div className="text-[#e6edf3] leading-relaxed text-lg whitespace-pre-wrap">
              {advice}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

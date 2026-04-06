import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/admin/DashboardLayout';

const QUICK_COMMANDS = [
  { label: 'List all products', cmd: 'Show me all products in the inventory' },
  { label: 'Check low stock', cmd: 'Which products have low stock levels?' },
  { label: 'Recent orders', cmd: 'Show me the most recent orders' },
  { label: 'Revenue report', cmd: 'What is the total revenue and profit?' },
  { label: 'System status', cmd: 'Check the status of the Firebase connection' },
  { label: 'Out of stock', cmd: 'List all products that are out of stock' },
];

export default function AIAgentPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '🤖 **Elite Perfumes AI Agent** is online.\n\nI\'m powered by Groq and connected to your Firestore database. I can help you manage inventory, track orders, generate reports, and more.\n\nEnter your admin password below to get started.' },
  ]);
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [passwordSet, setPasswordSet] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || !passwordSet) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/admin-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, message: msg, action: 'chat' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
      const reply = data.reply || data.message || data.response || data.result || JSON.stringify(data, null, 2);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${err.message}`, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>AI Agent — Elite Perfumes</title></Head>
      <DashboardLayout title="Active AI Agent">
        <div className="max-w-4xl mx-auto">
          {/* Status bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-2xl"
            style={{ background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.2)' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">AI Agent Online</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>🤖 Groq (Llama 3)</span>
              <span>🔥 Firebase Firestore</span>
              <span>🚀 Vercel API</span>
            </div>
            {passwordSet && (
              <span className="ml-auto text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                ✓ Authenticated
              </span>
            )}
          </motion.div>

          {/* Password setup */}
          {!passwordSet && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 rounded-2xl"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <h3 className="text-white font-bold mb-1">🔐 Authenticate to Activate</h3>
              <p className="text-gray-400 text-sm mb-4">Enter your admin API password to connect to the Vercel backend.</p>
              <div className="flex gap-3">
                <input
                  type="password"
                  placeholder="Admin API password..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && password) setPasswordSet(true); }}
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-white"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <button
                  onClick={() => { if (password) setPasswordSet(true); }}
                  disabled={!password}
                  className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: password ? 'linear-gradient(135deg,#d4af37,#fbbf24)' : 'rgba(255,255,255,0.05)', color: password ? '#030d1a' : '#4b5563' }}
                >
                  Activate →
                </button>
              </div>
            </motion.div>
          )}

          {/* Quick commands */}
          {passwordSet && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
              <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Quick Commands</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_COMMANDS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => sendMessage(c.cmd)}
                    disabled={loading}
                    className="text-xs px-3 py-2 rounded-full border transition-all hover:text-white disabled:opacity-50"
                    style={{ borderColor: 'rgba(13,148,136,0.3)', color: '#2dd4bf', background: 'rgba(13,148,136,0.06)' }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat window */}
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ height: '480px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}>
                      🤖
                    </div>
                  )}
                  <div
                    className="max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg,#0d9488,#14b8a6)', color: 'white', borderBottomRightRadius: 4 }
                        : msg.error
                        ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', borderBottomLeftRadius: 4 }
                        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: '#e2e8f0', borderBottomLeftRadius: 4 }
                    }
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(212,175,55,0.2)', color: '#fbbf24' }}>
                      A
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}>🤖</div>
                  <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-400"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 flex gap-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <input
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                placeholder={passwordSet ? 'Type your command...' : 'Enter password above to start...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !loading && passwordSet) sendMessage(); }}
                disabled={!passwordSet || loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading || !passwordSet}
                className="px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 flex-shrink-0"
                style={{ background: input.trim() && !loading && passwordSet ? 'linear-gradient(135deg,#d4af37,#fbbf24)' : 'rgba(255,255,255,0.05)', color: input.trim() && !loading && passwordSet ? '#030d1a' : '#4b5563' }}
              >
                Send
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

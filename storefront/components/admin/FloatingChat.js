import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTIONS = [
  { ar: 'اعرض جميع المنتجات', en: 'Show all products in stock' },
  { ar: 'المنتجات المنخفضة', en: 'What are the low stock items?' },
  { ar: 'آخر الطلبات', en: 'Show recent orders' },
  { ar: 'إجمالي الإيرادات', en: 'What is the total revenue?' },
];

export default function FloatingChat({ adminPassword }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🤖 مرحباً! أنا وكيل الذكاء الاصطناعي لعطور النخبة.\n\nأستطيع مساعدتك في إدارة المخزون، تتبع الطلبات، وعرض التقارير.\n\n(Hello! I\'m powered by Groq. Ask me anything about your store.)',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(adminPassword || '');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(!adminPassword);
  const [showTooltip, setShowTooltip] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Show tooltip briefly on mount
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setShowTooltip(true), 1500);
      const t2 = setTimeout(() => setShowTooltip(false), 5000);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, []);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    if (!password) { setShowPasswordPrompt(true); return; }

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
      if (!res.ok) throw new Error(data.error || data.message || `Error ${res.status}`);
      const reply = data.reply || data.message || data.response || data.result || JSON.stringify(data, null, 2);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ ${err.message}`,
        error: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-24 right-6 z-40 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={{ background: 'rgba(6,18,36,0.95)', border: '1px solid rgba(13,148,136,0.3)', backdropFilter: 'blur(10px)', maxWidth: '200px' }}
          >
            💬 تحدث مع الذكاء الاصطناعي!
            <div className="text-xs text-teal-400 mt-0.5">AI Agent — Click to open</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => { setOpen(o => !o); setShowTooltip(false); }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center shadow-2xl"
        style={{
          width: '60px', height: '60px',
          borderRadius: '20px',
          background: open ? 'rgba(239,68,68,0.2)' : 'linear-gradient(135deg,#0d9488,#14b8a6)',
          border: open ? '1px solid rgba(239,68,68,0.4)' : 'none',
          boxShadow: open ? 'none' : '0 8px 32px rgba(13,148,136,0.5)',
        }}
      >
        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl animate-ping" style={{ background: 'rgba(13,148,136,0.3)', animationDuration: '2.5s' }} />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-xl text-red-400">✕</motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} style={{ fontSize: '22px' }}>🤖</motion.span>
          )}
        </AnimatePresence>
        {/* Badge */}
        {!open && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-xs font-black" style={{ background: '#d4af37', color: '#030d1a', fontSize: '9px', lineHeight: '1.4' }}>
            AI
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{ width: '360px', maxWidth: 'calc(100vw - 24px)', height: '520px', background: 'rgba(6,18,36,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.15)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(212,175,55,0.1)', background: 'rgba(13,148,136,0.08)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}>
                🤖
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">وكيل الذكاء الاصطناعي</div>
                <div className="text-xs flex items-center gap-1" style={{ color: '#0d9488' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  مشغّل بـ Groq · Llama 3
                </div>
              </div>
              <button onClick={() => setShowPasswordPrompt(true)} className="text-gray-500 hover:text-gray-300 transition-colors" title="تغيير كلمة المرور">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </button>
            </div>

            {/* Password prompt overlay */}
            {showPasswordPrompt && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6" style={{ background: 'rgba(3,13,26,0.97)', backdropFilter: 'blur(10px)' }}>
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-white font-bold text-lg mb-1">كلمة مرور الإدارة</h3>
                <p className="text-gray-400 text-sm text-center mb-6">أدخل كلمة مرور API للوصول إلى وكيل الذكاء الاصطناعي</p>
                <input
                  type="password"
                  placeholder="كلمة مرور الإدارة..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && password) setShowPasswordPrompt(false); }}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white mb-3 text-right"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  autoFocus
                />
                <button
                  onClick={() => { if (password) setShowPasswordPrompt(false); }}
                  disabled={!password}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: password ? 'linear-gradient(135deg,#0d9488,#14b8a6)' : 'rgba(255,255,255,0.05)', color: password ? 'white' : '#4b5563' }}
                >
                  تفعيل الوكيل →
                </button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-xs text-sm leading-relaxed rounded-2xl px-4 py-2.5 whitespace-pre-wrap"
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg,#0d9488,#14b8a6)', color: 'white', borderBottomRightRadius: 4 }
                        : msg.error
                        ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderBottomLeftRadius: 4 }
                        : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', borderBottomLeftRadius: 4 }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-teal-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s.ar}
                    onClick={() => sendMessage(s.en)}
                    className="text-xs px-2.5 py-1.5 rounded-full border transition-all hover:text-white text-right"
                    style={{ borderColor: 'rgba(13,148,136,0.3)', color: '#2dd4bf', background: 'rgba(13,148,136,0.08)' }}
                  >
                    {s.ar}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب سؤالك هنا..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !loading) sendMessage(); }}
                  disabled={loading}
                  className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none text-right"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  dir="rtl"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                  style={{ background: input.trim() && !loading ? 'linear-gradient(135deg,#0d9488,#14b8a6)' : 'rgba(255,255,255,0.05)' }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

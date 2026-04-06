import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, sub, color = 'teal', delay = 0 }) {
  const colors = {
    teal: { bg: 'rgba(13,148,136,0.12)', border: 'rgba(13,148,136,0.25)', text: '#2dd4bf' },
    gold: { bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.25)', text: '#fbbf24' },
    red: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#f87171' },
    green: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
    purple: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', text: '#a78bfa' },
  };
  const c = colors[color] || colors.teal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${c.border}`,
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: c.bg }}>
          {icon}
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>
          Live
        </span>
      </div>
      <div className="text-3xl font-black text-white mb-1">
        {value !== undefined ? value.toLocaleString?.() ?? value : '—'}
      </div>
      <div className="text-sm font-semibold" style={{ color: c.text }}>{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </motion.div>
  );
}

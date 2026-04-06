import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', icon: '◈', label: 'Overview' },
  { href: '/dashboard/stock', icon: '📦', label: 'Stock' },
  { href: '/dashboard/orders', icon: '🛒', label: 'Orders' },
  { href: '/dashboard/analytics', icon: '📊', label: 'Analytics' },
  { href: '/dashboard/ai-agent', icon: '🤖', label: 'AI Agent' },
];

export default function DashboardLayout({ children, title = 'Dashboard' }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: '#030d1a', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
        style={{ background: 'rgba(6,18,36,0.98)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(212,175,55,0.1)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#d4af37,#fbbf24)' }}>
            <span className="text-xs font-black" style={{ color: '#030d1a' }}>EP</span>
          </div>
          <div>
            <div className="text-sm font-bold" style={{ background: 'linear-gradient(135deg,#d4af37,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Elite Perfumes
            </div>
            <div className="text-xs" style={{ color: '#0d9488' }}>Admin Console</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = router.pathname === item.href || (item.href !== '/dashboard' && router.pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                style={active ? { background: 'linear-gradient(135deg,rgba(13,148,136,0.25),rgba(212,175,55,0.1))', border: '1px solid rgba(13,148,136,0.3)', color: '#2dd4bf' } : {}}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="px-6 py-4 border-t space-y-2" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
            <span>←</span> Back to Storefront
          </Link>
          <Link href="/admin/login.html" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
            <span>🔒</span> Legacy Admin Panel
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(3,13,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.25)', color: '#2dd4bf' }}>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Live
            </div>
            <div className="text-xs text-gray-500">perfume-adbcb</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../contexts/CartContext';
import { useLang } from '../contexts/LanguageContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { tr, lang, switchLang, languages, currentLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const router = useRouter();
  const langRef = useRef(null);

  const isActive = (href) => router.pathname === href;

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: '/', label: tr.nav.home },
    { href: '/shop', label: tr.nav.shop },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(3,13,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#d4af37,#fbbf24)' }}>
              <span className="text-sm font-black" style={{ color: '#030d1a' }}>EP</span>
            </div>
            <div>
              <div className="text-sm font-bold leading-none gold-text">Elite Perfumes</div>
              <div className="text-xs leading-none font-arabic" style={{ color: '#0d9488' }}>عطور النخبة</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${isActive(link.href) ? 'text-teal-400' : 'text-gray-300 hover:text-white'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Language Switcher */}
            <div className="relative hidden md:block" ref={langRef}>
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                style={{ background: langOpen ? 'rgba(255,255,255,0.08)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span>{currentLang.flag}</span>
                <span>{currentLang.label}</span>
                <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute top-full mt-2 right-0 rounded-xl overflow-hidden shadow-2xl z-50 min-w-32" style={{ background: 'rgba(6,18,36,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { switchLang(l.code); setLangOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors text-left"
                      style={{
                        color: lang === l.code ? '#2dd4bf' : 'rgba(255,255,255,0.7)',
                        background: lang === l.code ? 'rgba(13,148,136,0.15)' : 'transparent',
                      }}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span>{l.name}</span>
                      {lang === l.code && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* Cart */}
            <Link
              href="/checkout"
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all btn-teal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {tr.nav.cart}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center" style={{ background: '#d4af37', color: '#030d1a' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 rounded-lg text-gray-300" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t py-4 space-y-2" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive(link.href) ? 'text-teal-400 bg-teal-900/20' : 'text-gray-300'}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile language switcher */}
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">{tr.nav.language}</p>
              <div className="flex gap-2">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { switchLang(l.code); setMobileOpen(false); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: lang === l.code ? 'linear-gradient(135deg,#0d9488,#14b8a6)' : 'rgba(255,255,255,0.06)',
                      color: lang === l.code ? 'white' : 'rgba(255,255,255,0.5)',
                      border: `1px solid ${lang === l.code ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </nav>
  );
}

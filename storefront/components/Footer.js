import Link from 'next/link';
import { useLang } from '../contexts/LanguageContext';

export default function Footer() {
  const { tr } = useLang();
  const f = tr.footer;

  return (
    <footer style={{ background: '#061224', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#d4af37,#fbbf24)' }}>
                <span className="font-black text-sm" style={{ color: '#030d1a' }}>EP</span>
              </div>
              <div>
                <div className="font-bold gold-text">{f.brand}</div>
                <div className="text-xs font-arabic" style={{ color: '#0d9488' }}>{f.brandSub}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{f.brandDesc}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider" style={{ color: '#d4af37' }}>{f.navigate}</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: f.home },
                { href: '/shop', label: f.shopAll },
                { href: '/checkout', label: f.cartCheckout },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#d4af37' }}>{f.information}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: f.cod },
                { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: f.authentic },
                { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: f.delivery },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gold-divider mt-10 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Elite Perfumes — عطور النخبة. {f.rights}
          </p>
          <p className="text-gray-600 text-xs">{f.badge}</p>
        </div>
      </div>
    </footer>
  );
}

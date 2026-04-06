import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import Head from 'next/head';
import { useLang } from '../contexts/LanguageContext';

export async function getServerSideProps() {
  try {
    const { adminDb } = await import('../lib/firebase-admin');
    const snap = await adminDb.collection('perfumes').orderBy('createdAt', 'desc').limit(8).get();
    const featured = snap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, createdAt: data.createdAt?.toDate?.()?.toISOString() || null };
    });
    return { props: { initialFeatured: featured } };
  } catch {
    return { props: { initialFeatured: [] } };
  }
}

export default function Home({ initialFeatured }) {
  const [featured, setFeatured] = useState(initialFeatured);
  const { tr } = useLang();
  const h = tr.home;

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const { products } = await res.json();
          setFeatured(products.slice(0, 8));
        }
      } catch {}
    };
    const interval = setInterval(poll, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Elite Perfumes — عطور النخبة | Premium Fragrances</title>
        <meta name="description" content="Discover premium fragrances from Elite Perfumes. Shop the finest perfumes with fast delivery and cash on delivery." />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh', background: 'radial-gradient(ellipse at 30% 50%, rgba(13,148,136,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(212,175,55,0.08) 0%, transparent 60%), #030d1a' }}>
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #d4af37, transparent)' }} />
        <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 py-20" style={{ minHeight: '90vh' }}>
          <div className="flex-1 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6" style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)', color: '#2dd4bf' }}>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              {h.badge}
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-4">
              <span className="text-white">{h.headline1}</span>
              <br />
              <span className="gold-text font-display italic">{h.headline2}</span>
              <br />
              <span className="text-white">{h.headline3}</span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed mb-4 max-w-xl">{h.subtitle}</p>
            <p className="text-base font-arabic mb-8" style={{ color: '#0d9488' }}>{h.tagline}</p>

            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-gold px-8 py-4 rounded-2xl text-base font-black inline-flex items-center gap-2">
                {h.cta}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/shop" className="px-8 py-4 rounded-2xl text-base font-bold border transition-all inline-flex items-center gap-2 text-gray-300 hover:text-white hover:border-teal-500" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                {h.viewAll}
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { label: h.stat1, value: '50+' },
                { label: h.stat2, value: '100%' },
                { label: h.stat3, value: '✓' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-black gold-text">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="w-52 h-52 lg:w-72 lg:h-72 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', border: '1px solid rgba(13,148,136,0.15)' }}>
                  <div className="w-36 h-36 lg:w-48 lg:h-48 rounded-full flex flex-col items-center justify-center glass-card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <svg className="w-14 h-14 mb-2" style={{ color: '#d4af37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span className="font-arabic text-sm font-bold" style={{ color: '#0d9488' }}>عطور النخبة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-500">{h.scroll}</span>
          <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Features strip */}
      <section style={{ background: '#061224', borderTop: '1px solid rgba(212,175,55,0.1)', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: h.feat1Title, sub: h.feat1Sub },
              { icon: '💰', title: h.feat2Title, sub: h.feat2Sub },
              { icon: '✅', title: h.feat3Title, sub: h.feat3Sub },
              { icon: '🌟', title: h.feat4Title, sub: h.feat4Sub },
            ].map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <div className="text-sm font-bold text-white">{f.title}</div>
                  <div className="text-xs text-gray-500">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-2">{h.collectionLabel}</p>
            <h2 className="text-4xl font-black text-white mb-3">
              {h.collectionTitle} <span className="gold-text">{h.collectionTitle2}</span>
            </h2>
            <p className="text-gray-400">{h.collectionSub}</p>
            <div className="gold-divider w-24 mx-auto mt-4" />
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🧴</div>
              <p className="text-gray-400">{h.noProducts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {featured.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/shop" className="btn-teal px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2">
                {h.viewAllProducts}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-10 lg:p-16 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(212,175,55,0.08) 100%)' }}>
            <div className="absolute top-0 left-0 w-full h-1 gold-divider" />
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">{h.ctaBannerTitle}</h2>
            <p className="text-gray-400 text-lg mb-2">
              {h.ctaBannerSub} <span className="text-teal-400 font-semibold">{h.ctaBannerService}</span>.
            </p>
            <p className="font-arabic text-gray-400 mb-8">{h.ctaBannerAr}</p>
            <Link href="/shop" className="btn-gold px-10 py-4 rounded-2xl font-black text-lg inline-block">
              {h.startShopping}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

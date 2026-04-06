import { useEffect, useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import Head from 'next/head';
import { useLang } from '../contexts/LanguageContext';

export async function getServerSideProps() {
  try {
    const { adminDb } = await import('../lib/firebase-admin');
    const snap = await adminDb.collection('perfumes').orderBy('createdAt', 'desc').get();
    const products = snap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, createdAt: data.createdAt?.toDate?.()?.toISOString() || null };
    });
    return { props: { initialProducts: products } };
  } catch {
    return { props: { initialProducts: [] } };
  }
}

export default function Shop({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { tr } = useLang();
  const s = tr.shop;
  const cats = s.categories;

  const CATEGORIES = Object.keys(cats);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const { products: fresh } = await res.json();
          setProducts(fresh);
        }
      } catch {}
    };
    const interval = setInterval(poll, 20000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.barcode?.includes(q)
      );
    }
    if (category !== 'All') {
      list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'price-desc': list.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'name': list.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      default: break;
    }
    return list;
  }, [products, search, category, sortBy]);

  const inStock = products.filter(p => p.quantity > 0).length;

  return (
    <>
      <Head>
        <title>Shop All Perfumes — Elite Perfumes</title>
      </Head>

      <div className="py-16 text-center relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, rgba(13,148,136,0.1) 0%, transparent 70%), #061224', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-2">{s.browse}</p>
        <h1 className="text-5xl font-black mb-3">
          <span className="gold-text">{s.title}</span> <span className="text-white">{s.title2}</span>
        </h1>
        <p className="text-gray-400">{`${products.length} ${s.fragrances} · ${inStock} ${s.inStock}`}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={s.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-input md:w-48">
            <option value="newest">{s.newest}</option>
            <option value="price-asc">{s.priceAsc}</option>
            <option value="price-desc">{s.priceDesc}</option>
            <option value="name">{s.nameAZ}</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat ? 'btn-gold' : 'text-gray-300 border border-gray-700 hover:border-teal-500 hover:text-white'
              }`}
            >
              {cats[cat]}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {s.showing} <span className="text-white font-semibold">{filtered.length}</span> {s.results}
          {search && <span> {s.for} "<span className="text-teal-400">{search}</span>"</span>}
          {category !== 'All' && <span> {s.in} <span className="text-teal-400">{cats[category]}</span></span>}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">{s.noProducts}</h3>
            <p className="text-gray-400 mb-6">{s.noProductsSub}</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-teal px-6 py-3 rounded-xl font-semibold">
              {s.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

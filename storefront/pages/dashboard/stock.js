import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/admin/DashboardLayout';
import FloatingChat from '../../components/admin/FloatingChat';

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const { products: p } = await res.json();
        setProducts(p);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 20000);
    return () => clearInterval(interval);
  }, []);

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce((s, p) => s + (p.quantity || 0), 0);
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= (p.minStock || 5));
  const outOfStock = products.filter(p => p.quantity <= 0);

  return (
    <>
      <Head><title>Stock Management — Elite Perfumes</title></Head>
      <DashboardLayout title="Stock Management">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Units', value: totalStock, color: '#2dd4bf' },
            { label: 'Low Stock', value: lowStock.length, color: '#fbbf24' },
            { label: 'Out of Stock', value: outOfStock.length, color: '#f87171' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="text-center p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}22` }}
            >
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: '16px', overflow: 'hidden' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(13,148,136,0.08)' }}>
                  {['Barcode', 'Name', 'Brand', 'Category', 'Cost', 'Price', 'Qty', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-4 py-3">
                        <div className="h-8 rounded shimmer" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-500">No products found</td></tr>
                ) : (
                  filtered.map((p, i) => {
                    const isLow = p.quantity > 0 && p.quantity <= (p.minStock || 5);
                    const isOut = p.quantity <= 0;
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-t hover:bg-white/5 transition-colors"
                        style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                      >
                        <td className="px-4 py-3 text-xs font-mono text-gray-400">{p.barcode || '—'}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-white max-w-32 truncate">{p.name}</td>
                        <td className="px-4 py-3 text-sm text-teal-400">{p.brand}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{p.category}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{(p.cost || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-bold" style={{ color: '#fbbf24' }}>{(p.price || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-bold text-white">{p.quantity}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                            background: isOut ? 'rgba(239,68,68,0.15)' : isLow ? 'rgba(251,191,36,0.15)' : 'rgba(16,185,129,0.15)',
                            color: isOut ? '#f87171' : isLow ? '#fbbf24' : '#34d399',
                          }}>
                            {isOut ? 'Out' : isLow ? 'Low' : 'OK'}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-xs text-gray-500">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            <button onClick={fetchProducts} className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </motion.div>
      </DashboardLayout>
      <FloatingChat />
    </>
  );
}

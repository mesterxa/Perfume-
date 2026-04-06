import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/admin/DashboardLayout';
import FloatingChat from '../../components/admin/FloatingChat';

const STATUS = {
  pending:    { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', label: 'Pending',    ar: 'قيد الانتظار' },
  processing: { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa', label: 'Processing', ar: 'جاري التجهيز' },
  completed:  { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', label: 'Completed',  ar: 'مكتمل' },
  cancelled:  { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', label: 'Cancelled',  ar: 'ملغى' },
};

export async function getServerSideProps() {
  try {
    const { adminDb } = await import('../../lib/firebase-admin');
    const snap = await adminDb.collection('orders').orderBy('createdAt', 'desc').limit(100).get();
    const orders = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        customer: data.customer || {},
        items: data.items || [],
        total: data.total || 0,
        status: data.status || 'pending',
        paymentMethod: data.paymentMethod || 'Cash on Delivery',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      };
    });
    return { props: { initialOrders: orders } };
  } catch {
    return { props: { initialOrders: [] } };
  }
}

export default function OrdersPage({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState('');

  // Poll for new orders every 30s
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/dashboard-stats');
        if (res.ok) {
          const json = await res.json();
          if (json.recentOrders) {
            // Fetch full orders from API
            const snap = await fetch('/api/orders-list');
            if (snap.ok) {
              const data = await snap.json();
              if (data.orders) setOrders(data.orders);
            }
          }
        }
      } catch {}
    };
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selected?.id === orderId) setSelected(prev => ({ ...prev, status: newStatus }));
      }
    } catch {}
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter;
    const matchSearch = !search.trim() ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone?.includes(search) ||
      o.customer?.city?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const pendingRevenue = orders.filter(o => o.status === 'pending').reduce((s, o) => s + (o.total || 0), 0);

  return (
    <>
      <Head><title>Orders — Elite Perfumes Admin</title></Head>
      <DashboardLayout title="Orders">

        {/* Revenue Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Orders', value: orders.length, icon: '🛒', color: '#2dd4bf' },
            { label: 'Pending', value: counts.pending, icon: '⏳', color: '#fbbf24' },
            { label: 'Completed', value: counts.completed, icon: '✅', color: '#34d399' },
            { label: 'Revenue (DZD)', value: totalRevenue.toLocaleString(), icon: '💰', color: '#d4af37' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7280' }}>Live</span>
              </div>
              <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, phone, city or order ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(counts).map(([key, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize flex items-center gap-1.5"
                style={filter === key
                  ? { background: 'linear-gradient(135deg,rgba(13,148,136,0.3),rgba(212,175,55,0.08))', border: '1px solid rgba(13,148,136,0.4)', color: '#2dd4bf' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#9ca3af' }}
              >
                {key === 'all' ? '🗂 All' : STATUS[key]?.label || key}
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Orders list */}
          <div className="lg:col-span-3 space-y-2.5">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500 rounded-2xl" style={{ border: '1px dashed rgba(255,255,255,0.07)' }}>
                <div className="text-4xl mb-3">📭</div>
                <p>{search ? 'No orders match your search' : 'No orders found'}</p>
              </div>
            ) : (
              filtered.map((order, i) => {
                const st = STATUS[order.status] || STATUS.pending;
                const isSelected = selected?.id === order.id;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelected(isSelected ? null : order)}
                    className="cursor-pointer rounded-2xl transition-all"
                    style={{
                      background: isSelected ? 'rgba(13,148,136,0.08)' : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${isSelected ? 'rgba(13,148,136,0.35)' : 'rgba(255,255,255,0.06)'}`,
                      padding: '14px 16px',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: st.bg, color: st.color }}>
                          {order.id.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate">{order.customer?.name || '—'}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>📞 {order.customer?.phone || '—'}</span>
                            {order.customer?.city && <span>· 📍 {order.customer.city}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                        <span className="text-sm font-black" style={{ color: '#fbbf24' }}>
                          {(order.total || 0).toLocaleString()} DZD
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <span className="text-xs text-gray-600">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} ·{' '}
                        {order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                      </span>
                      <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                        {order.status !== 'completed' && (
                          <button
                            onClick={() => updateStatus(order.id, 'completed')}
                            disabled={updating === order.id}
                            className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            {updating === order.id ? '...' : '✓ Done'}
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button
                            onClick={() => updateStatus(order.id, 'cancelled')}
                            disabled={updating === order.id}
                            className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
                            style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                          >
                            ✕ Cancel
                          </button>
                        )}
                        {order.status === 'cancelled' && (
                          <button
                            onClick={() => updateStatus(order.id, 'pending')}
                            disabled={updating === order.id}
                            className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
                            style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}
                          >
                            ↩ Restore
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Order detail panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  className="sticky top-24 rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)' }}
                >
                  {/* Header */}
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,148,136,0.06)' }}>
                    <div>
                      <div className="text-xs text-gray-500 font-mono">#{selected.id.slice(0, 12)}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{selected.customer?.name}</div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: STATUS[selected.status]?.bg, color: STATUS[selected.status]?.color }}>
                      {STATUS[selected.status]?.label}
                    </span>
                  </div>

                  <div className="p-5 space-y-4 text-sm">
                    {/* Customer Info */}
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</div>
                      <div className="space-y-2">
                        {[
                          { icon: '👤', val: selected.customer?.name },
                          { icon: '📞', val: selected.customer?.phone },
                          { icon: '📍', val: [selected.customer?.city, selected.customer?.address].filter(Boolean).join(' — ') },
                        ].filter(r => r.val).map((row, i) => (
                          <div key={i} className="flex items-start gap-2 text-gray-300">
                            <span className="text-base">{row.icon}</span>
                            <span className="text-xs leading-relaxed">{row.val}</span>
                          </div>
                        ))}
                        {selected.customer?.notes && (
                          <div className="mt-2 p-3 rounded-xl text-xs text-gray-400 italic" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            💬 {selected.customer.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                    {/* Items */}
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items ({selected.items?.length || 0})</div>
                      <div className="space-y-2">
                        {selected.items?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div>
                              <div className="text-white text-xs font-semibold">{item.name}</div>
                              <div className="text-gray-500 text-xs">{item.brand} · ×{item.quantity}</div>
                            </div>
                            <span className="text-xs font-bold text-teal-400">{(item.subtotal || item.price * item.quantity || 0).toLocaleString()} DZD</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">Total</span>
                      <span className="text-xl font-black" style={{ color: '#fbbf24' }}>{(selected.total || 0).toLocaleString()} DZD</span>
                    </div>
                    <div className="text-xs text-gray-500">💵 {selected.paymentMethod}</div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                    {/* Status actions */}
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Update Status</div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(STATUS).map(([key, st]) => (
                          <button
                            key={key}
                            onClick={() => updateStatus(selected.id, key)}
                            disabled={selected.status === key || updating === selected.id}
                            className="py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{
                              background: selected.status === key ? st.bg : 'rgba(255,255,255,0.04)',
                              color: selected.status === key ? st.color : '#6b7280',
                              border: `1px solid ${selected.status === key ? st.color + '40' : 'rgba(255,255,255,0.06)'}`,
                              opacity: updating === selected.id && selected.status !== key ? 0.5 : 1,
                            }}
                          >
                            {updating === selected.id && selected.status !== key ? '...' : st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-gray-600 text-sm rounded-2xl"
                  style={{ border: '1px dashed rgba(255,255,255,0.06)' }}
                >
                  <div className="text-4xl mb-3">👆</div>
                  <p>Click an order to view details</p>
                  <p className="text-xs mt-1 text-gray-700">& update status</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
      <FloatingChat />
    </>
  );
}

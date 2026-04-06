import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/admin/DashboardLayout';
import StatCard from '../../components/admin/StatCard';
import FloatingChat from '../../components/admin/FloatingChat';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard-stats');
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      setData(json);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const { stats, recentOrders = [], topProducts = [], lowStockItems = [] } = data || {};

  return (
    <>
      <Head><title>Dashboard — Elite Perfumes Admin</title></Head>
      <DashboardLayout title="Overview">

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="📦" label="Total Products" value={loading ? '...' : stats?.totalProducts} sub="In catalog" color="teal" delay={0} />
          <StatCard icon="💰" label="Revenue (DZD)" value={loading ? '...' : stats?.totalRevenue} sub="All-time sales" color="gold" delay={0.08} />
          <StatCard icon="🛒" label="Total Orders" value={loading ? '...' : stats?.totalOrders} sub={`${stats?.pendingOrders || 0} pending`} color="purple" delay={0.16} />
          <StatCard icon="⚠️" label="Low Stock" value={loading ? '...' : stats?.lowStock} sub={`${stats?.outOfStock || 0} out of stock`} color="red" delay={0.24} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Orders */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: '16px', padding: '20px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Recent Orders</h2>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(13,148,136,0.15)', color: '#2dd4bf' }}>{recentOrders.length} latest</span>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-lg shimmer" />)}</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No orders yet</div>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(13,148,136,0.2)', color: '#2dd4bf' }}>
                        #{order.id.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{order.customerName}</div>
                        <div className="text-xs text-gray-500">Order #{order.id.slice(0, 8)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold" style={{ color: '#fbbf24' }}>{(order.total || 0).toLocaleString()} DZD</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{
                        background: order.status === 'pending' ? 'rgba(251,191,36,0.15)' : order.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: order.status === 'pending' ? '#fbbf24' : order.status === 'completed' ? '#34d399' : '#f87171',
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Low Stock Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px', padding: '20px' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">⚠️</span>
              <h2 className="font-bold text-white">Low Stock Alerts</h2>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 rounded-lg shimmer" />)}</div>
            ) : lowStockItems.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-sm text-gray-400">All stock levels OK</div>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-center justify-between p-2.5 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.08)' }}
                  >
                    <span className="text-xs text-white font-medium truncate max-w-32">{item.name}</span>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: item.quantity === 0 ? '#f87171' : '#fbbf24' }}>
                      {item.quantity === 0 ? 'OUT' : `${item.quantity} left`}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '16px', padding: '20px' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Top Products by Price</h2>
            <div className="text-xs text-gray-500">Live from Firestore</div>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-lg shimmer" />)}</div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No products found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    {['#', 'Name', 'Brand', 'Price (DZD)', 'Stock'].map(h => (
                      <th key={h} className="text-xs text-gray-500 font-semibold pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {topProducts.map((p, i) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="border-t"
                      style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                    >
                      <td className="py-3 pr-4 text-gray-500 text-sm">{i + 1}</td>
                      <td className="py-3 pr-4 text-sm font-semibold text-white">{p.name}</td>
                      <td className="py-3 pr-4 text-sm text-teal-400">{p.brand}</td>
                      <td className="py-3 pr-4 text-sm font-bold" style={{ color: '#fbbf24' }}>{(p.price || 0).toLocaleString()}</td>
                      <td className="py-3 text-sm">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                          background: p.quantity > 5 ? 'rgba(16,185,129,0.15)' : p.quantity > 0 ? 'rgba(251,191,36,0.15)' : 'rgba(239,68,68,0.15)',
                          color: p.quantity > 5 ? '#34d399' : p.quantity > 0 ? '#fbbf24' : '#f87171',
                        }}>
                          {p.quantity}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Refresh button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </DashboardLayout>

      <FloatingChat />
    </>
  );
}

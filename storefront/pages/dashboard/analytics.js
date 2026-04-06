import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/admin/DashboardLayout';
import FloatingChat from '../../components/admin/FloatingChat';

function MetricBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="font-bold" style={{ color }}>{value.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard-stats')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const { stats, topProducts = [], recentOrders = [] } = data || {};
  const maxPrice = Math.max(...topProducts.map(p => p.price || 0), 1);

  return (
    <>
      <Head><title>Analytics — Elite Perfumes</title></Head>
      <DashboardLayout title="Analytics">
        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: stats?.totalRevenue, unit: 'DZD', color: '#fbbf24', icon: '💰' },
            { label: 'Net Profit', value: stats?.totalProfit, unit: 'DZD', color: '#34d399', icon: '📈' },
            { label: 'Total Orders', value: stats?.totalOrders, unit: '', color: '#a78bfa', icon: '🛒' },
            { label: 'Pending Orders', value: stats?.pendingOrders, unit: '', color: '#f87171', icon: '⏳' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${kpi.color}22`, borderRadius: '16px', padding: '20px' }}
            >
              <div className="text-2xl mb-2">{kpi.icon}</div>
              <div className="text-2xl font-black text-white">
                {loading ? '—' : (kpi.value || 0).toLocaleString()}
                {kpi.unit && <span className="text-sm font-normal text-gray-400 ml-1">{kpi.unit}</span>}
              </div>
              <div className="text-xs mt-1 font-semibold" style={{ color: kpi.color }}>{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top products by price */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '16px', padding: '20px' }}
          >
            <h3 className="font-bold text-white mb-5 flex items-center gap-2">
              <span className="text-lg">🏆</span> Product Price Ranking
            </h3>
            {loading ? (
              <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-8 shimmer rounded" />)}</div>
            ) : (
              <div className="space-y-4">
                {topProducts.map(p => (
                  <MetricBar key={p.id} label={`${p.name} (${p.brand})`} value={p.price || 0} max={maxPrice} color="#d4af37" />
                ))}
              </div>
            )}
          </motion.div>

          {/* Order status breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '20px' }}
          >
            <h3 className="font-bold text-white mb-5 flex items-center gap-2">
              <span className="text-lg">📊</span> Order Status
            </h3>
            {loading ? (
              <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-8 shimmer rounded" />)}</div>
            ) : (
              <>
                {[
                  { label: 'Pending', count: recentOrders.filter(o => o.status === 'pending').length, color: '#fbbf24' },
                  { label: 'Completed', count: recentOrders.filter(o => o.status === 'completed').length, color: '#34d399' },
                  { label: 'Cancelled', count: recentOrders.filter(o => o.status === 'cancelled').length, color: '#f87171' },
                ].map(s => (
                  <div key={s.label} className="mb-5">
                    <MetricBar label={s.label} value={s.count} max={Math.max(recentOrders.length, 1)} color={s.color} />
                  </div>
                ))}

                <div className="mt-6 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Inventory value</span>
                    <span className="font-bold text-white">
                      {loading ? '—' : (stats?.totalRevenue || 0).toLocaleString()} DZD
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Profit margin</span>
                    <span className="font-bold text-green-400">
                      {stats?.totalRevenue > 0 ? Math.round((stats.totalProfit / stats.totalRevenue) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
      <FloatingChat />
    </>
  );
}

import { adminDb } from '../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const [perfumesSnap, ordersSnap, salesSnap] = await Promise.all([
      adminDb.collection('perfumes').get(),
      adminDb.collection('orders').get(),
      adminDb.collection('sales').get(),
    ]);

    const perfumes = perfumesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const sales = salesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const totalProducts = perfumes.length;
    const totalStock = perfumes.reduce((s, p) => s + (p.quantity || 0), 0);
    const lowStock = perfumes.filter(p => p.quantity <= (p.minStock || 5) && p.quantity > 0);
    const outOfStock = perfumes.filter(p => p.quantity <= 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = sales.reduce((s, t) => s + (t.totalSale || 0), 0);
    const totalProfit = sales.reduce((s, t) => s + (t.profit || 0), 0);

    const recentOrders = orders
      .sort((a, b) => {
        const aTime = a.createdAt?._seconds || 0;
        const bTime = b.createdAt?._seconds || 0;
        return bTime - aTime;
      })
      .slice(0, 5)
      .map(o => ({
        id: o.id,
        customerName: o.customer?.name || 'Unknown',
        total: o.total,
        status: o.status,
      }));

    const topProducts = [...perfumes]
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 5)
      .map(p => ({ id: p.id, name: p.name, brand: p.brand, price: p.price, quantity: p.quantity }));

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      stats: { totalProducts, totalStock, lowStock: lowStock.length, outOfStock: outOfStock.length, totalOrders, pendingOrders, totalRevenue, totalProfit },
      recentOrders,
      topProducts,
      lowStockItems: lowStock.slice(0, 5).map(p => ({ id: p.id, name: p.name, quantity: p.quantity, minStock: p.minStock })),
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch dashboard data', details: err.message });
  }
}

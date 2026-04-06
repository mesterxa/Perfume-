import { adminDb } from '../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
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
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load orders' });
  }
}

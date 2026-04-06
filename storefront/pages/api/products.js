import { adminDb } from '../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const snap = await adminDb.collection('perfumes').orderBy('createdAt', 'desc').get();
    const products = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      };
    });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ products });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}

import { adminDb } from '../../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const docSnap = await adminDb.collection('perfumes').doc(id).get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const data = docSnap.data();
    const product = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    };
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ product });
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
}

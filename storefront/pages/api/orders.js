import { adminDb } from '../../lib/firebase-admin';
import admin from 'firebase-admin';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return createOrder(req, res);
  }
  if (req.method === 'PATCH') {
    return updateOrderStatus(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function createOrder(req, res) {
  const { customer, items, total, paymentMethod } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }
  if (!customer.name || !customer.phone || !customer.address) {
    return res.status(400).json({ error: 'Customer information is incomplete' });
  }

  try {
    const orderData = {
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city?.trim() || '',
        notes: customer.notes?.trim() || '',
      },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand || '',
        price: Number(item.price),
        quantity: Number(item.quantity),
        subtotal: Number(item.subtotal),
      })),
      total: Number(total),
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('orders').add(orderData);
    return res.status(201).json({ success: true, orderId: docRef.id });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Failed to create order. Please try again.' });
  }
}

async function updateOrderStatus(req, res) {
  const { orderId, status } = req.body;
  const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];

  if (!orderId || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order ID or status' });
  }

  try {
    await adminDb.collection('orders').doc(orderId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(200).json({ success: true, orderId, status });
  } catch (err) {
    console.error('Order update error:', err);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
}

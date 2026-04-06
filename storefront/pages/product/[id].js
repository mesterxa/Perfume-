import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  try {
    const { adminDb } = await import('../../lib/firebase-admin');
    const docSnap = await adminDb.collection('perfumes').doc(id).get();
    if (!docSnap.exists) return { notFound: true };
    const data = docSnap.data();
    return {
      props: {
        initialProduct: {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        },
      },
    };
  } catch {
    return { notFound: true };
  }
}

export default function ProductPage({ initialProduct }) {
  const [product, setProduct] = useState(initialProduct);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { dispatch } = useCart();

  // Poll for real-time stock updates
  useEffect(() => {
    if (!product?.id) return;
    const poll = async () => {
      try {
        const res = await fetch(`/api/products/${product.id}`);
        if (res.ok) {
          const { product: fresh } = await res.json();
          setProduct(fresh);
        }
      } catch {}
    };
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [product?.id]);

  const outOfStock = product?.quantity <= 0;

  const handleAddToCart = () => {
    if (!product || outOfStock) return;
    for (let i = 0; i < qty; i++) {
      dispatch({
        type: 'ADD_ITEM',
        item: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          stock: product.quantity,
          category: product.category,
        },
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="text-center py-32">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
        <Link href="/shop" className="btn-teal px-6 py-3 rounded-xl font-semibold">Back to Shop</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} — Elite Perfumes</title>
        <meta name="description" content={`Buy ${product.name} by ${product.brand}. Premium fragrance at ${product.price} DZD.`} />
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-300">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Visual */}
          <div className="glass-card flex flex-col items-center justify-center p-12 min-h-80" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.05) 0%, rgba(212,175,55,0.05) 100%)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.2),rgba(13,148,136,0.2))', border: '2px solid rgba(212,175,55,0.3)' }}>
              <svg className="w-12 h-12" style={{ color: '#d4af37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-arabic">{product.category}</p>
            {outOfStock && (
              <span className="mt-4 px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                Out of Stock
              </span>
            )}
            {!outOfStock && product.quantity <= (product.minStock || 5) && (
              <span className="mt-4 badge-gold">Low Stock — {product.quantity} left</span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-teal-400 font-semibold mb-1">{product.brand}</p>
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">{product.name}</h1>

            {product.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit" style={{ background: 'rgba(13,148,136,0.15)', color: '#2dd4bf', border: '1px solid rgba(13,148,136,0.2)' }}>
                {product.category}
              </span>
            )}

            <div className="mb-6 p-4 glass-card rounded-xl">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black gold-text">{product.price?.toLocaleString()}</span>
                <span className="text-gray-400 mb-1">DZD</span>
              </div>
              <p className="text-xs text-teal-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cash on Delivery available
              </p>
            </div>

            {!outOfStock && (
              <p className="text-sm text-gray-400 mb-4">
                <span className="text-green-400 font-semibold">{product.quantity} in stock</span>
              </p>
            )}

            {product.barcode && (
              <div className="flex items-center gap-2 text-sm mb-4">
                <span className="text-gray-500 w-20">Barcode</span>
                <span className="text-gray-300 font-mono">{product.barcode}</span>
              </div>
            )}

            {!outOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-400">Quantity:</span>
                <div className="flex items-center glass-card rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-bold">−</button>
                  <span className="px-6 py-3 text-white font-bold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.quantity, q + 1))} className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-bold">+</button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 ${
                  outOfStock ? 'opacity-40 cursor-not-allowed bg-gray-700 text-gray-400' : added ? 'btn-teal' : 'btn-gold'
                }`}
              >
                {added ? (
                  <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Added!</>
                ) : outOfStock ? 'Out of Stock' : (
                  <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> Add to Cart</>
                )}
              </button>
              <Link href="/checkout" className="flex-1 py-4 rounded-2xl font-bold border text-center text-gray-300 hover:text-white transition-colors" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                View Cart
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[{ icon: '🔒', text: 'Secure Order' }, { icon: '✅', text: 'Authentic' }, { icon: '🚚', text: 'Fast Delivery' }].map(b => (
                <div key={b.text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Link href="/shop" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}

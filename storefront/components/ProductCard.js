import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';

export default function ProductCard({ product }) {
  const { dispatch, items } = useCart();
  const { tr } = useLang();
  const p = tr.product;
  const [added, setAdded] = useState(false);

  const inCart = items.find(i => i.id === product.id);
  const outOfStock = product.quantity <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
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
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="block product-card cursor-pointer" onClick={handleAddToCart}>
      <div className="glass-card overflow-hidden h-full flex flex-col">
        {/* Product image placeholder */}
        <div className="relative" style={{ paddingBottom: '66%', background: 'linear-gradient(135deg, #061224 0%, #0a1a32 100%)' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(13,148,136,0.15))', border: '1px solid rgba(212,175,55,0.2)' }}>
              <svg className="w-8 h-8" style={{ color: '#d4af37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(13,148,136,0.2)', color: '#2dd4bf' }}>
              {product.category || 'Perfume'}
            </span>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {outOfStock && (
              <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: 'rgba(239,68,68,0.9)', color: 'white' }}>
                {p.outOfStock}
              </span>
            )}
            {!outOfStock && product.quantity <= product.minStock && (
              <span className="badge-gold">{p.inStock}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <p className="text-xs font-semibold mb-1" style={{ color: '#0d9488' }}>{product.brand}</p>
            <h3 className="font-bold text-white text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>
            {product.category && (
              <p className="text-xs text-gray-500 mb-3">{product.category}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-xl font-black gold-text">{product.price?.toLocaleString()}</span>
              <span className="text-xs text-gray-400 ml-1">{p.dinar}</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                outOfStock
                  ? 'opacity-40 cursor-not-allowed bg-gray-700 text-gray-400'
                  : added
                  ? 'btn-teal'
                  : 'btn-gold'
              }`}
              style={{ minWidth: '90px' }}
            >
              {added ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  ✓
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {p.addToCart}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

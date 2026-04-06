import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { useLang } from '../contexts/LanguageContext';

export default function Checkout() {
  const { items, cartTotal, cartCount, dispatch } = useCart();
  const { tr } = useLang();
  const c = tr.checkout;
  const router = useRouter();
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', notes: '' });
  const [errors, setErrors] = useState({});

  const updateField = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = c.fullName + ' *';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9) e.phone = c.phone + ' *';
    if (!form.address.trim()) e.address = c.address + ' *';
    if (!form.city.trim()) e.city = c.city + ' *';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStep('submitting');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map(i => ({
            id: i.id,
            name: i.name,
            brand: i.brand,
            price: i.price,
            quantity: i.quantity,
            subtotal: i.price * i.quantity,
          })),
          total: cartTotal,
          paymentMethod: 'Cash on Delivery',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      dispatch({ type: 'CLEAR_CART' });
      router.push(`/order-success?orderId=${data.orderId}&name=${encodeURIComponent(form.name)}&total=${cartTotal}`);
    } catch (err) {
      setStep('details');
      setErrors({ submit: err.message || 'Failed to place order. Please try again.' });
    }
  };

  if (cartCount === 0 && step !== 'submitting') {
    return (
      <>
        <Head><title>{c.cartTitle} — Elite Perfumes</title></Head>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-3xl font-black text-white mb-3">{c.emptyCart}</h2>
          <p className="text-gray-400 mb-8">{c.emptyCartSub}</p>
          <Link href="/shop" className="btn-gold px-8 py-4 rounded-2xl font-black">
            {c.continueShopping}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>{c.title} — Elite Perfumes</title></Head>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            {step === 'cart' ? c.cartTitle : c.deliveryDetails}
          </h1>
          <div className="flex items-center gap-3 mt-4">
            {['cart', 'details'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />}
                <div className={`flex items-center gap-2 text-sm font-semibold ${step === s || (s === 'cart' && step === 'details') ? 'text-teal-400' : 'text-gray-500'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? 'btn-teal' : (i < ['cart','details'].indexOf(step) ? 'btn-teal opacity-60' : 'bg-gray-700 text-gray-400')}`}>
                    {i + 1}
                  </div>
                  {s === 'cart' ? c.cartTitle : c.deliveryDetails}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {(step === 'cart' || step === 'details') && (
              <div className="glass-card p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">{items.length} {c.cartTitle}</h2>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <svg className="w-7 h-7" style={{ color: '#d4af37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-teal-400 font-semibold">{item.brand}</p>
                        <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                        <p className="text-gray-400 text-xs">{(item.price * item.quantity).toLocaleString()} {tr.product.dinar}</p>
                      </div>
                      {step === 'cart' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity - 1 })} className="w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 flex items-center justify-center font-bold transition-colors">−</button>
                          <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity + 1 })} className="w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 flex items-center justify-center font-bold transition-colors">+</button>
                          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })} className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-900/20" style={{ color: '#f87171' }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                      {step === 'details' && (
                        <div className="text-right">
                          <div className="text-white font-bold">×{item.quantity}</div>
                          <div className="text-xs text-gray-400">{item.price?.toLocaleString()} {tr.product.dinar}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 'details' && (
              <div className="glass-card p-6 animate-fade-in">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span>📋</span> {c.deliveryDetails}
                </h2>
                <div className="space-y-4">
                  {[
                    { key: 'name', label: c.fullName, placeholder: c.fullName, type: 'text' },
                    { key: 'phone', label: c.phone, placeholder: '05XX XXX XXX', type: 'tel' },
                    { key: 'city', label: c.city, placeholder: c.city, type: 'text' },
                    { key: 'address', label: c.address, placeholder: c.address, type: 'text' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-sm text-gray-400 mb-1 block">{field.label} *</label>
                      <input className="form-input" type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={e => updateField(field.key, e.target.value)} />
                      {errors[field.key] && <p className="text-red-400 text-xs mt-1">⚠ {c[field.key] || field.label} مطلوب</p>}
                    </div>
                  ))}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">{c.notes}</label>
                    <textarea className="form-input resize-none" rows={3} placeholder={c.notesPlaceholder} value={form.notes} onChange={e => updateField('notes', e.target.value)} />
                  </div>
                  {errors.submit && (
                    <div className="p-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      {errors.submit}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">{c.cartTitle}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{c.subtotal}</span>
                  <span>{cartTotal.toLocaleString()} {tr.product.dinar}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{c.delivery}</span>
                  <span className="text-green-400">{c.free}</span>
                </div>
              </div>

              <div className="gold-divider mb-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-white font-bold">{c.total}</span>
                <div className="text-right">
                  <div className="text-2xl font-black gold-text">{cartTotal.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{tr.product.dinar}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl mb-6" style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)' }}>
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-400">
                  <span>💵</span> {c.cod}
                </div>
                <p className="text-xs text-gray-400 mt-1">{c.codNote}</p>
              </div>

              {step === 'cart' && (
                <div className="space-y-3">
                  <button onClick={() => setStep('details')} className="btn-gold w-full py-4 rounded-2xl font-black text-base">
                    {c.proceedToCheckout} →
                  </button>
                  <Link href="/shop" className="block text-center text-sm text-gray-400 hover:text-white transition-colors py-2">
                    {c.continueShopping}
                  </Link>
                </div>
              )}

              {step === 'details' && (
                <div className="space-y-3">
                  <button onClick={handleSubmit} disabled={step === 'submitting'} className="btn-gold w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2">
                    {c.placeOrder}
                  </button>
                  <button onClick={() => setStep('cart')} className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors py-2">
                    ← {c.back}
                  </button>
                </div>
              )}

              {step === 'submitting' && (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#d4af37', borderTopColor: 'transparent' }} />
                  <p className="text-sm text-gray-400">{c.placing}</p>
                </div>
              )}

              <div className="mt-6 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {['🔒', '✅', '⭐'].map((icon, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{icon}</span>
                    {[tr.product.inStock, tr.product.addToCart, 'Elite Perfumes'][i]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

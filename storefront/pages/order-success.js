import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function OrderSuccess() {
  const router = useRouter();
  const { orderId, name, total } = router.query;

  return (
    <>
      <Head><title>Order Confirmed — Elite Perfumes</title></Head>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center animate-slide-up">
          {/* Success icon */}
          <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(212,175,55,0.1))', border: '2px solid rgba(13,148,136,0.3)' }}>
            <svg className="w-14 h-14 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-4xl font-black text-white mb-3">Order Confirmed!</h1>
          <p className="font-arabic text-xl mb-6" style={{ color: '#0d9488' }}>تم تأكيد طلبك بنجاح</p>

          {name && (
            <p className="text-gray-300 text-lg mb-2">
              Thank you, <span className="font-bold text-white">{name}</span>!
            </p>
          )}
          <p className="text-gray-400 mb-8">
            Your order has been placed successfully. Our team will contact you shortly to confirm delivery details.
          </p>

          {/* Order details card */}
          <div className="glass-card p-6 mb-8 text-left">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Order Details</h3>
            <div className="space-y-3">
              {orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Order ID</span>
                  <span className="text-white font-mono text-sm font-semibold">{orderId.slice(0, 8).toUpperCase()}</span>
                </div>
              )}
              {total && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Order Total</span>
                  <span className="text-xl font-black gold-text">{Number(total).toLocaleString()} DZD</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Payment</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(13,148,136,0.2)', color: '#2dd4bf', border: '1px solid rgba(13,148,136,0.3)' }}>
                  Cash on Delivery
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Status</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                  Pending Confirmation
                </span>
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm text-gray-400 leading-relaxed">
              📞 We will call you to confirm your order and delivery address before shipping.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-gold px-8 py-4 rounded-2xl font-black inline-block">
              Continue Shopping
            </Link>
            <Link href="/" className="px-8 py-4 rounded-2xl font-bold border text-gray-300 hover:text-white transition-colors inline-block text-center" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

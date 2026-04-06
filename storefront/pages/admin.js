import Head from 'next/head';
import { useEffect } from 'react';

export default function AdminRedirect() {
  useEffect(() => {
    window.location.href = '/admin/login.html';
  }, []);

  return (
    <>
      <Head><title>Admin Panel — Elite Perfumes</title></Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#d4af37', borderTopColor: 'transparent' }} />
          <p className="text-gray-400">Redirecting to Admin Panel...</p>
        </div>
      </div>
    </>
  );
}

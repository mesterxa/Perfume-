import '../styles/globals.css';
import { CartProvider } from '../contexts/CartContext';
import { LanguageProvider, useLang } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const DASHBOARD_ROUTES = ['/dashboard'];

function AppShell({ Component, pageProps }) {
  const router = useRouter();
  const { currentLang } = useLang();
  const isDashboard = DASHBOARD_ROUTES.some(r => router.pathname.startsWith(r));

  useEffect(() => {
    document.documentElement.dir = currentLang.dir;
    document.documentElement.lang = currentLang.code;
  }, [currentLang]);

  if (isDashboard) {
    return <Component {...pageProps} />;
  }

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <AppShell Component={Component} pageProps={pageProps} />
    </LanguageProvider>
  );
}

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PromoCards } from './components/PromoCards';
import { TrustBadges } from './components/TrustBadges';
import { ProductGrid } from './components/ProductGrid';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { activePage } = useStore();

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] flex flex-col font-sans selection:bg-[#E61919] selection:text-white">
      <Navbar />

      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <HeroBanner />
            <PromoCards />
            <TrustBadges />
            <ProductGrid />
            <CustomerReviewsSection />
          </>
        )}

        {activePage === 'shop' && (
          <>
            <div className="bg-[#1A1A1A] border-b border-[#333333] py-6 px-4 text-center">
              <h1 className="text-2xl sm:text-3xl font-black italic text-white uppercase tracking-tight">
                Imported Hot Wheels Catalog
              </h1>
              <p className="text-xs text-[#888888] mt-1 font-mono">
                Authentic 1:64 scale diecast models with Real Riders rubber tires & metal chassis.
              </p>
            </div>
            <ProductGrid />
            <TrustBadges />
          </>
        )}

        {activePage === 'checkout' && <CheckoutPage />}

        {activePage === 'tracking' && <OrderTrackingPage />}

        {activePage === 'reviews' && <CustomerReviewsSection />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <QuickViewModal />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}

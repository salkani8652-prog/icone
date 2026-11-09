import React, { useState } from 'react';
import { ProductProvider, useProducts } from './context/ProductContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TechComparison } from './components/TechComparison';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { RfqModal } from './components/RfqModal';
import { AdminLoginModal } from './components/AdminCMS/AdminLoginModal';
import { AdminDashboard } from './components/AdminCMS/AdminDashboard';
import { ProductEditorModal } from './components/AdminCMS/ProductEditorModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { Product } from './types/radio';

function MainApp() {
  const {
    isAdmin,
    activeDetailProduct,
    setActiveDetailProduct,
    activeRfqProduct,
    setActiveRfqProduct,
    editingProduct,
    setEditingProduct,
    isCreateModalOpen,
    setIsCreateModalOpen,
  } = useProducts();

  const [currentView, setCurrentView] = useState<'catalog' | 'cms' | 'compare' | 'guide'>('catalog');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setCurrentView('cms');
  };

  const handleViewDetail = (product: Product) => {
    setActiveDetailProduct(product);
  };

  const handleOpenRfq = (product: Product) => {
    setActiveRfqProduct(product);
  };

  const handleOpenCompare = () => {
    setIsCompareModalOpen(true);
  };

  const handleSelectCategoryFromFooter = (category: string) => {
    setCurrentView('catalog');
    const el = document.getElementById('katalog-produk');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'compare') {
            setIsCompareModalOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        openLoginModal={handleOpenLogin}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'cms' && isAdmin ? (
          <AdminDashboard
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onOpenEdit={(product) => setEditingProduct(product)}
            onViewLiveCatalog={() => setCurrentView('catalog')}
          />
        ) : currentView === 'guide' ? (
          <div>
            <TechComparison
              onSelectCategory={(cat) => {
                setCurrentView('catalog');
                setTimeout(() => {
                  const el = document.getElementById('katalog-produk');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />
          </div>
        ) : (
          /* Public Catalog View */
          <div>
            <Hero
              onExploreCatalog={() => {
                const el = document.getElementById('katalog-produk');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenGuide={() => setCurrentView('guide')}
              onOpenRfq={() => {
                // If no product selected, open RFQ with default/top product
                const el = document.getElementById('katalog-produk');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Product Catalog Grid & Filters */}
            <ProductCatalog
              onViewDetail={handleViewDetail}
              onOpenRfq={handleOpenRfq}
              onOpenCompare={handleOpenCompare}
            />

            {/* Quick Tech Architecture Primer */}
            <div className="border-t border-slate-900 bg-slate-950/60 py-12">
              <TechComparison
                onSelectCategory={(cat) => {
                  const el = document.getElementById('katalog-produk');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategoryFromFooter}
        onOpenGuide={() => setCurrentView('guide')}
        onOpenCompare={handleOpenCompare}
        onOpenLogin={handleOpenLogin}
      />

      {/* Global Modals */}
      <ProductDetailModal
        product={activeDetailProduct}
        onClose={() => setActiveDetailProduct(null)}
        onOpenRfq={(product) => {
          setActiveDetailProduct(null);
          setActiveRfqProduct(product);
        }}
      />

      <RfqModal
        product={activeRfqProduct}
        onClose={() => setActiveRfqProduct(null)}
      />

      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onOpenRfq={(product) => {
          setIsCompareModalOpen(false);
          setActiveRfqProduct(product);
        }}
      />

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* CMS Product Editor Modal (for both Add and Edit) */}
      {(editingProduct || isCreateModalOpen) && (
        <ProductEditorModal
          isOpen={Boolean(editingProduct || isCreateModalOpen)}
          onClose={() => {
            setEditingProduct(null);
            setIsCreateModalOpen(false);
          }}
          productToEdit={editingProduct}
        />
      )}

      {/* Live Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <MainApp />
    </ProductProvider>
  );
}

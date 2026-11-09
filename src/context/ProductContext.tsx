import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/radio';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ProductContextType {
  products: Product[];
  isAdmin: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  adminPin: string;
  isDefaultPin: boolean;
  changeAdminPin: (oldPin: string, newPin: string) => boolean;
  resetAdminPin: () => void;
  
  // CRUD
  addProduct: (newProduct: Omit<Product, 'id' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  resetToDefault: () => void;
  
  // JSON Backup / Restore
  exportCatalogJson: () => void;
  importCatalogJson: (jsonString: string) => { success: boolean; message: string };
  
  // Compare system
  comparedProductIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  
  // Active detail modal
  activeDetailProduct: Product | null;
  setActiveDetailProduct: (product: Product | null) => void;
  
  // Active RFQ modal
  activeRfqProduct: Product | null;
  setActiveRfqProduct: (product: Product | null) => void;
  
  // Active Edit modal for CMS
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  
  // Toast notifications
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEY_PRODUCTS = 'nexus_radio_products_v1';
const STORAGE_KEY_ADMIN_PIN = 'nexus_radio_admin_pin_v1';
const STORAGE_KEY_ADMIN_AUTH = 'nexus_radio_admin_auth_v1';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize legacy Nexus names to Icone
          return parsed.map((item: Product) => ({
            ...item,
            name: item.name ? item.name.replace(/Nexus/g, 'Icone') : item.name,
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load products from localStorage', e);
    }
    return DEFAULT_PRODUCTS;
  });

  const [adminPin, setAdminPinState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || 'admin123';
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
  });

  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [activeRfqProduct, setActiveRfqProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isDefaultPin = (adminPin || 'admin123').trim() === 'admin123';

  const loginAdmin = (pin: string): boolean => {
    const cleanPin = pin.trim();
    const currentStored = (localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || adminPin || 'admin123').trim();
    
    if (cleanPin === currentStored) {
      setIsAdmin(true);
      localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      showToast('Berhasil login sebagai Administrator CMS', 'success');
      return true;
    }
    showToast('Password / PIN Admin salah. Silakan coba lagi.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    showToast('Mode Administrator telah ditutup', 'info');
  };

  const changeAdminPin = (oldPin: string, newPin: string): boolean => {
    const cleanOld = oldPin.trim();
    const cleanNew = newPin.trim();
    const currentStored = (localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || adminPin || 'admin123').trim();

    if (cleanOld !== currentStored) {
      showToast('Password / PIN lama tidak sesuai', 'error');
      return false;
    }
    if (cleanNew.length < 4) {
      showToast('Password baru minimal 4 karakter', 'error');
      return false;
    }
    setAdminPinState(cleanNew);
    localStorage.setItem(STORAGE_KEY_ADMIN_PIN, cleanNew);
    showToast('Password Administrator berhasil diperbarui!', 'success');
    return true;
  };

  const resetAdminPin = (): void => {
    setAdminPinState('admin123');
    localStorage.setItem(STORAGE_KEY_ADMIN_PIN, 'admin123');
    showToast('Password berhasil di-reset ke default: admin123', 'info');
  };

  const addProduct = (newProductData: Omit<Product, 'id' | 'updatedAt'>) => {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newProduct: Product = {
      ...newProductData,
      id,
      updatedAt: now,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produk "${newProduct.name}" berhasil ditambahkan ke katalog`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const now = new Date().toISOString().split('T')[0];
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: now } : item
      )
    );
    showToast('Data produk & spesifikasi teknis berhasil diperbarui', 'success');
    if (activeDetailProduct && activeDetailProduct.id === id) {
      setActiveDetailProduct((prev) => (prev ? { ...prev, ...updates, updatedAt: now } : null));
    }
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setComparedProductIds((prev) => prev.filter((pId) => pId !== id));
    if (activeDetailProduct && activeDetailProduct.id === id) {
      setActiveDetailProduct(null);
    }
    showToast(`Produk "${target?.name || id}" berhasil dihapus dari katalog`, 'info');
  };

  const duplicateProduct = (id: string) => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;
    const now = new Date().toISOString().split('T')[0];
    const cloned: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      name: `${existing.name} (Salinan)`,
      modelCode: `${existing.modelCode}-COPY`,
      updatedAt: now,
      isFeatured: false,
    };
    setProducts((prev) => [cloned, ...prev]);
    showToast(`Berhasil menduplikasi "${existing.name}". Silakan edit spesifikasinya.`, 'success');
  };

  const resetToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    showToast('Katalog produk telah di-reset ke data bawaan pabrikan', 'info');
  };

  const exportCatalogJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `katalog_icone_globaltech_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File backup katalog JSON berhasil diunduh', 'success');
  };

  const importCatalogJson = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return { success: false, message: 'Format file tidak valid. Harus berupa array produk JSON.' };
      }
      // Check first item structure
      const sample = parsed[0];
      if (!sample.name || !sample.category || !sample.specs) {
        return { success: false, message: 'Struktur produk JSON tidak sesuai dengan spesifikasi Icone Globaltech.' };
      }
      setProducts(parsed);
      showToast(`Berhasil mengimpor ${parsed.length} produk ke dalam katalog`, 'success');
      return { success: true, message: `Berhasil mengimpor ${parsed.length} produk.` };
    } catch {
      return { success: false, message: 'Gagal memproses JSON. Pastikan format file teks benar.' };
    }
  };

  const toggleCompare = (id: string) => {
    if (comparedProductIds.includes(id)) {
      setComparedProductIds((prev) => prev.filter((pId) => pId !== id));
      showToast('Dihapus dari daftar perbandingan', 'info');
    } else {
      if (comparedProductIds.length >= 3) {
        showToast('Maksimal membandingkan 3 produk sekaligus', 'error');
        return;
      }
      setComparedProductIds((prev) => [...prev, id]);
      showToast('Ditambahkan ke perbandingan spesifikasi', 'success');
    }
  };

  const clearCompare = () => {
    setComparedProductIds([]);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        adminPin,
        isDefaultPin,
        changeAdminPin,
        resetAdminPin,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        resetToDefault,
        exportCatalogJson,
        importCatalogJson,
        comparedProductIds,
        toggleCompare,
        clearCompare,
        activeDetailProduct,
        setActiveDetailProduct,
        activeRfqProduct,
        setActiveRfqProduct,
        editingProduct,
        setEditingProduct,
        isCreateModalOpen,
        setIsCreateModalOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

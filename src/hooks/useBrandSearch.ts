import { useEffect } from 'react';
import { useBrand } from '../contexts/BrandContext';

/**
 * Hook to sync brand selection with algolia service
 * Automatically updates search results when brand changes
 * Note: Brand switching is now handled directly in BrandSwitcher component
 */
export const useBrandSearch = () => {
  const { brand } = useBrand();

  useEffect(() => {
    // Apply brand colors to CSS variables
    if (brand.colors) {
      document.documentElement.style.setProperty('--brand-primary', brand.colors.primary);
      document.documentElement.style.setProperty('--brand-secondary', brand.colors.secondary);
      document.documentElement.style.setProperty('--brand-accent', brand.colors.accent);
    }
  }, [brand]);

  return { brand };
};


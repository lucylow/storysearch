import { useEffect } from 'react';
import { useBrand } from '../contexts/BrandContext';
import { algoliaService } from '../services/algoliaService';

/**
 * Hook to sync brand selection with algolia service
 * Automatically updates search results when brand changes
 */
export const useBrandSearch = () => {
  const { currentBrand } = useBrand();

  useEffect(() => {
    // Update algolia service with current brand
    algoliaService.setBrand(currentBrand);
  }, [currentBrand]);

  return { currentBrand };
};


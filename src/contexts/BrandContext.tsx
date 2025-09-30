import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BrandConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo?: string;
  font: string;
}

interface BrandContextType {
  brand: BrandConfig;
  setBrand: (brand: BrandConfig) => void;
  updateBrandColor: (colorType: keyof BrandConfig['colors'], color: string) => void;
}

const defaultBrand: BrandConfig = {
  name: 'StorySearch AI',
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B'
  },
  font: 'Inter, system-ui, sans-serif'
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brand, setBrand] = useState<BrandConfig>(defaultBrand);

  const updateBrandColor = (colorType: keyof BrandConfig['colors'], color: string) => {
    setBrand(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: color
      }
    }));
  };

  return (
    <BrandContext.Provider value={{
      brand,
      setBrand,
      updateBrandColor
    }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within BrandProvider');
  }
  return context;
};
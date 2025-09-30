import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BrandKey } from '../data/brandMockData';

interface BrandContextType {
  currentBrand: BrandKey;
  setBrand: (brand: BrandKey) => void;
  brandConfig: BrandConfig | null;
}

interface BrandConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  personality: string;
  tone: string;
}

const brandConfigs: Record<BrandKey, BrandConfig | null> = {
  'healthtech': {
    name: 'HealthTech Solutions',
    colors: {
      primary: '#0066CC',
      secondary: '#00A86B',
      accent: '#FF6B6B'
    },
    personality: 'professional',
    tone: 'empathetic'
  },
  'edulearn': {
    name: 'EduLearn Academy',
    colors: {
      primary: '#FF6B35',
      secondary: '#004E89',
      accent: '#FFC145'
    },
    personality: 'friendly',
    tone: 'encouraging'
  },
  'fashionforward': {
    name: 'FashionForward',
    colors: {
      primary: '#000000',
      secondary: '#E4B4C2',
      accent: '#C9A961'
    },
    personality: 'sophisticated',
    tone: 'trendy'
  },
  'financeflow': {
    name: 'FinanceFlow',
    colors: {
      primary: '#1A4D2E',
      secondary: '#F0F0F0',
      accent: '#FF8800'
    },
    personality: 'authoritative',
    tone: 'professional'
  },
  'gamershub': {
    name: 'GamersHub',
    colors: {
      primary: '#7B2CBF',
      secondary: '#00F5FF',
      accent: '#FF006E'
    },
    personality: 'energetic',
    tone: 'casual'
  },
  'default': null
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState<BrandKey>('default');

  const setBrand = (brand: BrandKey) => {
    setCurrentBrand(brand);
    
    // Apply brand colors to CSS variables if config exists
    const config = brandConfigs[brand];
    if (config) {
      document.documentElement.style.setProperty('--brand-primary', config.colors.primary);
      document.documentElement.style.setProperty('--brand-secondary', config.colors.secondary);
      document.documentElement.style.setProperty('--brand-accent', config.colors.accent);
    }
  };

  const brandConfig = brandConfigs[currentBrand];

  return (
    <BrandContext.Provider value={{ currentBrand, setBrand, brandConfig }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};


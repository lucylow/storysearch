import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { useBrand } from '../contexts/BrandContext';
import { BrandKey } from '../data/brandMockData';
import { algoliaService } from '../services/algoliaService';

interface BrandOption {
  key: BrandKey;
  name: string;
  icon: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  font: string;
}

const brands: BrandOption[] = [
  {
    key: 'default',
    name: 'Default (Storyblok Demo)',
    icon: '📚',
    description: 'Original CMS content',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B'
    },
    font: 'Inter, system-ui, sans-serif'
  },
  {
    key: 'healthtech',
    name: 'HealthTech Solutions',
    icon: '🏥',
    description: 'Healthcare & Medical',
    colors: {
      primary: '#0066CC',
      secondary: '#00A86B',
      accent: '#FF6B6B'
    },
    font: 'Inter, system-ui'
  },
  {
    key: 'edulearn',
    name: 'EduLearn Academy',
    icon: '🎓',
    description: 'Education & Learning',
    colors: {
      primary: '#FF6B35',
      secondary: '#004E89',
      accent: '#FFC145'
    },
    font: 'Poppins, sans-serif'
  },
  {
    key: 'fashionforward',
    name: 'FashionForward',
    icon: '🛍️',
    description: 'Fashion & E-commerce',
    colors: {
      primary: '#000000',
      secondary: '#E4B4C2',
      accent: '#C9A961'
    },
    font: 'Playfair Display, serif'
  },
  {
    key: 'financeflow',
    name: 'FinanceFlow',
    icon: '💰',
    description: 'Financial Services',
    colors: {
      primary: '#1A4D2E',
      secondary: '#F0F0F0',
      accent: '#FF8800'
    },
    font: 'Roboto, sans-serif'
  },
  {
    key: 'gamershub',
    name: 'GamersHub',
    icon: '🎮',
    description: 'Gaming Community',
    colors: {
      primary: '#7B2CBF',
      secondary: '#00F5FF',
      accent: '#FF006E'
    },
    font: 'Orbitron, sans-serif'
  }
];

const BrandSwitcher: React.FC = () => {
  const { brand, setBrand } = useBrand();
  const [isOpen, setIsOpen] = useState(false);

  const currentBrandInfo = brands.find(b => b.name === brand.name) || brands[0];

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors shadow-sm"
      >
        <Palette className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentBrandInfo?.icon} {currentBrandInfo?.name}
        </span>
        <span className="text-sm font-medium sm:hidden">
          {currentBrandInfo?.icon}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  🎨 Demo Brand Customization
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Switch between industries to see tailored content
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {brands.map((brandOption) => {
                  const isSelected = brandOption.name === brand.name;
                  
                  return (
                    <button
                      key={brandOption.key}
                      onClick={() => {
                        // Update brand context
                        setBrand({
                          name: brandOption.name,
                          colors: brandOption.colors,
                          font: brandOption.font
                        });
                        // Update algolia service
                        algoliaService.setBrand(brandOption.key);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{brandOption.icon}</span>
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {brandOption.name}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {brandOption.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  💡 Each brand shows industry-specific search results and AI responses
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandSwitcher;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { useBrand } from '../contexts/BrandContext';
import { BrandKey } from '../data/brandMockData';

const brands = [
  {
    key: 'default' as BrandKey,
    name: 'Default (Storyblok Demo)',
    icon: '📚',
    description: 'Original CMS content'
  },
  {
    key: 'healthtech' as BrandKey,
    name: 'HealthTech Solutions',
    icon: '🏥',
    description: 'Healthcare & Medical'
  },
  {
    key: 'edulearn' as BrandKey,
    name: 'EduLearn Academy',
    icon: '🎓',
    description: 'Education & Learning'
  },
  {
    key: 'fashionforward' as BrandKey,
    name: 'FashionForward',
    icon: '🛍️',
    description: 'Fashion & E-commerce'
  },
  {
    key: 'financeflow' as BrandKey,
    name: 'FinanceFlow',
    icon: '💰',
    description: 'Financial Services'
  },
  {
    key: 'gamershub' as BrandKey,
    name: 'GamersHub',
    icon: '🎮',
    description: 'Gaming Community'
  }
];

const BrandSwitcher: React.FC = () => {
  const { currentBrand, setBrand } = useBrand();
  const [isOpen, setIsOpen] = useState(false);

  const currentBrandInfo = brands.find(b => b.key === currentBrand);

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
                {brands.map((brand) => {
                  const isSelected = brand.key === currentBrand;
                  
                  return (
                    <button
                      key={brand.key}
                      onClick={() => {
                        setBrand(brand.key);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{brand.icon}</span>
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {brand.name}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {brand.description}
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


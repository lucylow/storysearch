import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BrandKey } from '@/data/brandMockData';

interface BrandSelectorProps {
  currentBrand: BrandKey;
  onBrandChange: (brand: BrandKey) => void;
}

const brands = [
  {
    key: 'nike' as BrandKey,
    name: 'Nike',
    icon: '👟',
    description: 'Sportswear & Campaigns',
    gradient: 'from-orange-500 to-red-600',
    stats: { totalContent: 8 }
  },
  {
    key: 'blackpink' as BrandKey,
    name: 'BLACKPINK',
    icon: '🎵',
    description: 'K-Pop & Fashion',
    gradient: 'from-pink-500 to-purple-600',
    stats: { totalContent: 5 }
  },
  {
    key: 'ishowspeed' as BrandKey,
    name: 'iShowSpeed',
    icon: '🎮',
    description: 'Gaming & Vlogs',
    gradient: 'from-blue-500 to-cyan-600',
    stats: { totalContent: 3 }
  },
  {
    key: 'default' as BrandKey,
    name: 'All Content',
    icon: '🌟',
    description: 'Mixed Brands',
    gradient: 'from-gray-500 to-slate-600',
    stats: { totalContent: 13 }
  }
];

const BrandSelector: React.FC<BrandSelectorProps> = ({ currentBrand, onBrandChange }) => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Select Content Brand
        </h3>
        <p className="text-xs text-muted-foreground">
          Demo featuring Nike products, BLACKPINK music, and iShowSpeed content
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {brands.map((brand, index) => {
          const isSelected = currentBrand === brand.key;

          return (
            <motion.div
              key={brand.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => onBrandChange(brand.key)}
                className={`w-full relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-primary shadow-[0_0_30px_hsl(var(--primary)/0.3)]'
                    : 'border-border/50 hover:border-primary/50'
                }`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${brand.gradient} opacity-10`} />
                
                {/* Content */}
                <div className="relative p-4 text-left">
                  {/* Icon and check */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{brand.icon}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-1 rounded-full bg-primary text-white"
                      >
                        <Check className="w-3 h-3" />
                      </motion.div>
                    )}
                  </div>

                  {/* Brand info */}
                  <h4 className="font-bold text-sm mb-1">{brand.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {brand.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {brand.stats.totalContent} items
                    </Badge>
                    {isSelected && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-green-500"
                      />
                    )}
                  </div>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="brandSelector"
                    className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandSelector;


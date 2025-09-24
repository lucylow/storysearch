import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Users, Search } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

const SearchAnalytics: React.FC = () => {
  const { hasSearched, results } = useSearch();

  if (!hasSearched) {
    return null;
  }

  const analytics = [
    {
      icon: Search,
      label: 'Results Found',
      value: results.length,
      change: '+12%',
      positive: true
    },
    {
      icon: Clock,
      label: 'Avg. Response Time',
      value: '0.3s',
      change: '-15%',
      positive: true
    },
    {
      icon: TrendingUp,
      label: 'Relevance Score',
      value: '94%',
      change: '+8%',
      positive: true
    },
    {
      icon: Users,
      label: 'Search Sessions',
      value: '847',
      change: '+23%',
      positive: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 p-6 glass rounded-2xl border border-border"
    >
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Search Analytics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {analytics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 glass rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
          >
            <metric.icon className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
            <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
            <div className={`text-xs font-medium ${
              metric.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchAnalytics;
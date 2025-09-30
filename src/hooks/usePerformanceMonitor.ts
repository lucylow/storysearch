import { useEffect, useState, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  networkRequests: number;
  errorCount: number;
  userInteractions: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    networkRequests: 0,
    errorCount: 0,
    userInteractions: 0
  });

  const startTime = useRef<number>(Date.now());
  const renderStartTime = useRef<number>(0);
  const interactionCount = useRef<number>(0);

  useEffect(() => {
    // Measure initial load time
    const loadTime = Date.now() - startTime.current;
    setMetrics(prev => ({ ...prev, loadTime }));

    // Monitor memory usage if available
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memoryInfo.usedJSHeapSize / 1024 / 1024 // Convert to MB
      }));
    }

    // Monitor network requests
    const observer = new PerformanceObserver((list) => {
      const networkEntries = list.getEntries().filter(entry => 
        entry.entryType === 'resource'
      );
      setMetrics(prev => ({
        ...prev,
        networkRequests: networkEntries.length
      }));
    });

    observer.observe({ entryTypes: ['resource'] });

    // Monitor errors
    const errorHandler = () => {
      setMetrics(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1
      }));
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    // Monitor user interactions
    const interactionHandler = () => {
      interactionCount.current += 1;
      setMetrics(prev => ({
        ...prev,
        userInteractions: interactionCount.current
      }));
    };

    const events = ['click', 'keydown', 'scroll', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, interactionHandler, { passive: true });
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
      events.forEach(event => {
        document.removeEventListener(event, interactionHandler);
      });
    };
  }, []);

  const measureRender = (callback: () => void) => {
    renderStartTime.current = performance.now();
    callback();
    const renderTime = performance.now() - renderStartTime.current;
    setMetrics(prev => ({ ...prev, renderTime }));
  };

  const logMetrics = () => {
    console.group(`🚀 Performance Metrics - ${componentName}`);
    console.log(`Load Time: ${metrics.loadTime}ms`);
    console.log(`Render Time: ${metrics.renderTime}ms`);
    if (metrics.memoryUsage) {
      console.log(`Memory Usage: ${metrics.memoryUsage.toFixed(2)}MB`);
    }
    console.log(`Network Requests: ${metrics.networkRequests}`);
    console.log(`Errors: ${metrics.errorCount}`);
    console.log(`User Interactions: ${metrics.userInteractions}`);
    console.groupEnd();
  };

  const getPerformanceScore = (): number => {
    let score = 100;
    
    // Penalize slow load times
    if (metrics.loadTime > 1000) score -= 20;
    else if (metrics.loadTime > 500) score -= 10;
    
    // Penalize slow render times
    if (metrics.renderTime > 100) score -= 15;
    else if (metrics.renderTime > 50) score -= 5;
    
    // Penalize high memory usage
    if (metrics.memoryUsage && metrics.memoryUsage > 50) score -= 10;
    
    // Penalize many network requests
    if (metrics.networkRequests > 20) score -= 10;
    
    // Penalize errors
    if (metrics.errorCount > 0) score -= metrics.errorCount * 5;
    
    return Math.max(0, Math.min(100, score));
  };

  return {
    metrics,
    measureRender,
    logMetrics,
    getPerformanceScore
  };
};

export default usePerformanceMonitor;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  Battery, 
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Settings,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MobileUXEnhancementsProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileUXEnhancements: React.FC<MobileUXEnhancementsProps> = ({ isOpen, onClose }) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    touchFriendly: false
  });

  useEffect(() => {
    // Detect device type
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">UX Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Optimize your experience for {deviceType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Device Detection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                Device Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {deviceType === 'mobile' && <Smartphone className="w-4 h-4 text-blue-600" />}
                  {deviceType === 'tablet' && <Tablet className="w-4 h-4 text-green-600" />}
                  {deviceType === 'desktop' && <Monitor className="w-4 h-4 text-purple-600" />}
                  <span className="text-sm font-medium capitalize">{deviceType}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {window.innerWidth}px
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Reduced Motion</p>
                  <p className="text-xs text-muted-foreground">Minimize animations</p>
                </div>
                <Button
                  variant={preferences.reducedMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePreference('reducedMotion')}
                >
                  {preferences.reducedMotion ? <Check className="w-4 h-4" /> : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">High Contrast</p>
                  <p className="text-xs text-muted-foreground">Enhanced visibility</p>
                </div>
                <Button
                  variant={preferences.highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePreference('highContrast')}
                >
                  {preferences.highContrast ? <Check className="w-4 h-4" /> : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Large Text</p>
                  <p className="text-xs text-muted-foreground">Bigger font sizes</p>
                </div>
                <Button
                  variant={preferences.largeText ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePreference('largeText')}
                >
                  {preferences.largeText ? <Check className="w-4 h-4" /> : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Touch Friendly</p>
                  <p className="text-xs text-muted-foreground">Larger touch targets</p>
                </div>
                <Button
                  variant={preferences.touchFriendly ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePreference('touchFriendly')}
                >
                  {preferences.touchFriendly ? <Check className="w-4 h-4" /> : 'Off'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme & Audio */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Theme & Audio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isDarkMode ? <Moon className="w-4 h-4 text-blue-600" /> : <Sun className="w-4 h-4 text-yellow-600" />}
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <Button
                  variant={isDarkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-green-600" />}
                  <span className="text-sm font-medium">Sound Effects</span>
                </div>
                <Button
                  variant={isMuted ? "outline" : "default"}
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? 'Off' : 'On'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-Specific Tips */}
          {deviceType === 'mobile' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Mobile Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  <p>• Swipe down to refresh search results</p>
                  <p>• Pinch to zoom on result cards</p>
                  <p>• Long press for quick actions</p>
                  <p>• Use voice search for hands-free searching</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Apply Settings
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// Touch gesture handler hook
export const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (isLeftSwipe) {
      // Handle left swipe
      console.log('Left swipe detected');
    }
    if (isRightSwipe) {
      // Handle right swipe
      console.log('Right swipe detected');
    }
    if (isUpSwipe) {
      // Handle up swipe
      console.log('Up swipe detected');
    }
    if (isDownSwipe) {
      // Handle down swipe
      console.log('Down swipe detected');
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

// Responsive breakpoint hook
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint('sm');
      } else if (width < 768) {
        setBreakpoint('md');
      } else if (width < 1024) {
        setBreakpoint('lg');
      } else {
        setBreakpoint('xl');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl'
  };
};

export default MobileUXEnhancements;

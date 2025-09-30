import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
  screenWidth: number;
  screenHeight: number;
}

export const useMobile = (): MobileDetection => {
  const [mobileInfo, setMobileInfo] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    orientation: 'landscape',
    screenWidth: 1024,
    screenHeight: 768
  });

  useEffect(() => {
    const updateMobileInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Touch device detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Screen size breakpoints
      const isMobile = width < 640; // sm breakpoint
      const isTablet = width >= 640 && width < 1024; // sm to lg
      const isDesktop = width >= 1024; // lg and above
      
      // Orientation detection
      const orientation = height > width ? 'portrait' : 'landscape';

      setMobileInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        orientation,
        screenWidth: width,
        screenHeight: height
      });
    };

    // Initial check
    updateMobileInfo();

    // Listen for resize events
    window.addEventListener('resize', updateMobileInfo);
    window.addEventListener('orientationchange', updateMobileInfo);

    return () => {
      window.removeEventListener('resize', updateMobileInfo);
      window.removeEventListener('orientationchange', updateMobileInfo);
    };
  }, []);

  return mobileInfo;
};

// Hook for mobile-specific gestures
export const useMobileGestures = () => {
  const [gestures, setGestures] = useState({
    swipeLeft: false,
    swipeRight: false,
    swipeUp: false,
    swipeDown: false,
    pinch: false,
    longPress: false
  });

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let longPressTimer: NodeJS.Timeout;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();

      // Long press detection
      longPressTimer = setTimeout(() => {
        setGestures(prev => ({ ...prev, longPress: true }));
      }, 500);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      clearTimeout(longPressTimer);
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;
      
      // Swipe detection (minimum distance and speed)
      const minSwipeDistance = 50;
      const maxSwipeTime = 300;
      
      if (deltaTime < maxSwipeTime) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > minSwipeDistance) {
            setGestures(prev => ({ ...prev, swipeRight: true }));
          } else if (deltaX < -minSwipeDistance) {
            setGestures(prev => ({ ...prev, swipeLeft: true }));
          }
        } else {
          // Vertical swipe
          if (deltaY > minSwipeDistance) {
            setGestures(prev => ({ ...prev, swipeDown: true }));
          } else if (deltaY < -minSwipeDistance) {
            setGestures(prev => ({ ...prev, swipeUp: true }));
          }
        }
      }
      
      // Reset gestures after a short delay
      setTimeout(() => {
        setGestures({
          swipeLeft: false,
          swipeRight: false,
          swipeUp: false,
          swipeDown: false,
          pinch: false,
          longPress: false
        });
      }, 100);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Clear long press timer if user moves finger
      if (Math.abs(e.touches[0].clientX - startX) > 10 || Math.abs(e.touches[0].clientY - startY) > 10) {
        clearTimeout(longPressTimer);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(longPressTimer);
    };
  }, []);

  return gestures;
};

// Hook for mobile-specific interactions
export const useMobileInteractions = () => {
  const [interactions, setInteractions] = useState({
    isKeyboardOpen: false,
    isScrolling: false,
    scrollDirection: 'down' as 'up' | 'down',
    isAtTop: true,
    isAtBottom: false
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      
      setInteractions(prev => ({
        ...prev,
        isScrolling: true,
        scrollDirection,
        isAtTop: currentScrollY === 0,
        isAtBottom: currentScrollY + window.innerHeight >= document.documentElement.scrollHeight
      }));

      lastScrollY = currentScrollY;

      // Clear scrolling state after scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setInteractions(prev => ({ ...prev, isScrolling: false }));
      }, 150);
    };

    const handleResize = () => {
      // Detect keyboard open/close on mobile
      const heightDiff = window.screen.height - window.innerHeight;
      const isKeyboardOpen = heightDiff > 150; // Threshold for keyboard detection
      
      setInteractions(prev => ({ ...prev, isKeyboardOpen }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return interactions;
};


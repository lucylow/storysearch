import { useEffect, useState, useRef } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    screenReader: false,
    keyboardNavigation: true
  });

  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<Element | null>(null);
  const focusHistory = useRef<Element[]>([]);

  useEffect(() => {
    // Detect screen reader
    const hasScreenReader = window.speechSynthesis && 'speak' in window.speechSynthesis;
    setSettings(prev => ({ ...prev, screenReader: hasScreenReader }));

    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSettings(prev => ({ ...prev, reducedMotion: prefersReducedMotion }));

    // Detect high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    setSettings(prev => ({ ...prev, highContrast: prefersHighContrast }));

    // Monitor keyboard usage
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    // Track focus changes
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Element;
      setCurrentFocus(target);
      
      // Add to focus history
      if (target && !focusHistory.current.includes(target)) {
        focusHistory.current.push(target);
        if (focusHistory.current.length > 10) {
          focusHistory.current.shift();
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply settings to document
    if (key === 'highContrast') {
      document.body.classList.toggle('high-contrast', value);
    }
    
    if (key === 'reducedMotion') {
      document.body.classList.toggle('reduced-motion', value);
    }
    
    if (key === 'fontSize') {
      document.body.className = document.body.className.replace(/font-size-\w+/g, '');
      document.body.classList.add(`font-size-${value}`);
    }
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.screenReader) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const focusElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element && element instanceof HTMLElement) {
      element.focus();
      announceToScreenReader(`Focused on ${element.getAttribute('aria-label') || element.textContent || 'element'}`);
    }
  };

  const skipToContent = () => {
    const mainContent = document.querySelector('main, [role="main"], #main-content');
    if (mainContent && mainContent instanceof HTMLElement) {
      mainContent.focus();
      announceToScreenReader('Skipped to main content');
    }
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  const getAccessibilityScore = (): number => {
    let score = 0;
    
    // Check for proper ARIA labels
    const elementsWithAriaLabels = document.querySelectorAll('[aria-label], [aria-labelledby]');
    const totalInteractiveElements = document.querySelectorAll('button, input, select, textarea, a[href]');
    const ariaLabelRatio = elementsWithAriaLabels.length / Math.max(totalInteractiveElements.length, 1);
    score += Math.min(30, ariaLabelRatio * 30);
    
    // Check for proper heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const hasH1 = document.querySelector('h1') !== null;
    score += hasH1 ? 20 : 0;
    
    // Check for alt text on images
    const images = document.querySelectorAll('img');
    const imagesWithAlt = document.querySelectorAll('img[alt]');
    const altTextRatio = images.length > 0 ? imagesWithAlt.length / images.length : 1;
    score += Math.min(25, altTextRatio * 25);
    
    // Check for keyboard navigation support
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    score += focusableElements.length > 0 ? 25 : 0;
    
    return Math.min(100, Math.max(0, score));
  };

  return {
    settings,
    isKeyboardUser,
    currentFocus,
    updateSetting,
    announceToScreenReader,
    focusElement,
    skipToContent,
    trapFocus,
    getAccessibilityScore
  };
};

export default useAccessibility;

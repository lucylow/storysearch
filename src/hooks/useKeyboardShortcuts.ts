import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, altKey, shiftKey, metaKey } = event;

    // Find matching shortcut
    const matchingShortcut = shortcutsRef.current.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === key.toLowerCase() &&
        !!shortcut.ctrl === ctrlKey &&
        !!shortcut.alt === altKey &&
        !!shortcut.shift === shiftKey &&
        !!shortcut.meta === metaKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      event.stopPropagation();
      matchingShortcut.action();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    triggerShortcut: (key: string, modifiers?: {
      ctrl?: boolean;
      alt?: boolean;
      shift?: boolean;
      meta?: boolean;
    }) => {
      const shortcut = shortcutsRef.current.find(s => 
        s.key === key && 
        s.ctrl === modifiers?.ctrl &&
        s.alt === modifiers?.alt &&
        s.shift === modifiers?.shift &&
        s.meta === modifiers?.meta
      );
      
      if (shortcut) {
        shortcut.action();
      }
    }
  };
};

export const defaultShortcuts: KeyboardShortcut[] = [
  // Navigation
  {
    key: '/',
    action: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    description: 'Focus search',
    category: 'Navigation'
  },
  {
    key: 'k',
    ctrl: true,
    action: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    description: 'Focus search',
    category: 'Navigation'
  },
  {
    key: 'Escape',
    action: () => {
      // Close any open modals or overlays
      const modals = document.querySelectorAll('[role="dialog"], .modal, .overlay');
      modals.forEach(modal => {
        const closeButton = modal.querySelector('[aria-label="close"], .close, [data-dismiss="modal"]');
        if (closeButton) {
          (closeButton as HTMLElement).click();
        }
      });
    },
    description: 'Close modal/overlay',
    category: 'Navigation'
  },
  
  // Search
  {
    key: 'Enter',
    ctrl: true,
    action: () => {
      const searchButton = document.querySelector('button[type="submit"], button[aria-label*="search" i]') as HTMLButtonElement;
      if (searchButton) {
        searchButton.click();
      }
    },
    description: 'Execute search',
    category: 'Search'
  },
  {
    key: 'f',
    ctrl: true,
    action: () => {
      // Toggle advanced filters
      const filterButton = document.querySelector('[data-filter-toggle], button[aria-label*="filter" i]') as HTMLButtonElement;
      if (filterButton) {
        filterButton.click();
      }
    },
    description: 'Toggle filters',
    category: 'Search'
  },
  
  // Results
  {
    key: 'ArrowDown',
    action: () => {
      const results = document.querySelectorAll('[data-result-item], .result-item, .search-result');
      const current = document.activeElement;
      const currentIndex = Array.from(results).indexOf(current as Element);
      const next = results[Math.min(currentIndex + 1, results.length - 1)];
      if (next) {
        (next as HTMLElement).focus();
      }
    },
    description: 'Next result',
    category: 'Results'
  },
  {
    key: 'ArrowUp',
    action: () => {
      const results = document.querySelectorAll('[data-result-item], .result-item, .search-result');
      const current = document.activeElement;
      const currentIndex = Array.from(results).indexOf(current as Element);
      const prev = results[Math.max(currentIndex - 1, 0)];
      if (prev) {
        (prev as HTMLElement).focus();
      }
    },
    description: 'Previous result',
    category: 'Results'
  },
  
  // UI
  {
    key: '?',
    action: () => {
      const helpButton = document.querySelector('[data-help-toggle], button[aria-label*="help" i]') as HTMLButtonElement;
      if (helpButton) {
        helpButton.click();
      }
    },
    description: 'Show help',
    category: 'UI'
  },
  {
    key: 'h',
    ctrl: true,
    action: () => {
      const homeLink = document.querySelector('a[href="/"], a[href="/app"]') as HTMLAnchorElement;
      if (homeLink) {
        homeLink.click();
      }
    },
    description: 'Go home',
    category: 'UI'
  }
];

export default useKeyboardShortcuts;

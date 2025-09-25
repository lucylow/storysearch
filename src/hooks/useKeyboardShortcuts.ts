import React, { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrlKey &&
        !!event.shiftKey === !!shortcut.shiftKey &&
        !!event.altKey === !!shortcut.altKey &&
        !!event.metaKey === !!shortcut.metaKey
      );
    });

    if (matchingShortcut) {
      if (preventDefault) {
        event.preventDefault();
      }
      matchingShortcut.action();
    }
  }, [shortcuts, enabled, preventDefault]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Common search shortcuts
export const useSearchShortcuts = (actions: {
  focusSearch: () => void;
  clearSearch: () => void;
  toggleFilters: () => void;
  toggleViewMode: () => void;
  openAIChat: () => void;
  toggleVoiceSearch: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '/',
      action: actions.focusSearch,
      description: 'Focus search input'
    },
    {
      key: 'Escape',
      action: actions.clearSearch,
      description: 'Clear search'
    },
    {
      key: 'f',
      ctrlKey: true,
      action: actions.toggleFilters,
      description: 'Toggle filters'
    },
    {
      key: 'v',
      ctrlKey: true,
      action: actions.toggleViewMode,
      description: 'Toggle view mode'
    },
    {
      key: 'a',
      ctrlKey: true,
      action: actions.openAIChat,
      description: 'Open AI chat'
    },
    {
      key: 'm',
      ctrlKey: true,
      action: actions.toggleVoiceSearch,
      description: 'Toggle voice search'
    }
  ];

  useKeyboardShortcuts(shortcuts);
};

// Help modal with shortcuts
export const KeyboardShortcutsHelp: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: '/', description: 'Focus search input' },
    { key: 'Escape', description: 'Clear search' },
    { key: 'Ctrl + F', description: 'Toggle filters' },
    { key: 'Ctrl + V', description: 'Toggle view mode' },
    { key: 'Ctrl + A', description: 'Open AI chat' },
    { key: 'Ctrl + M', description: 'Toggle voice search' },
    { key: '↑/↓', description: 'Navigate suggestions' },
    { key: 'Enter', description: 'Select suggestion' },
    { key: 'Tab', description: 'Focus next element' },
    { key: 'Shift + Tab', description: 'Focus previous element' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">?</kbd> anytime to see this help
          </p>
        </div>
      </div>
    </div>
  );
};

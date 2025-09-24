import { useState, useCallback } from 'react';

export const useVoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(async (): Promise<string | null> => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      return null;
    }

    setIsListening(true);
    setError(null);

    return new Promise((resolve) => {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        resolve(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    });
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    error
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
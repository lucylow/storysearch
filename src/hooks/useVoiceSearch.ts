import { useState, useCallback, useRef } from 'react';

export const useVoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(async (): Promise<string | null> => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return null;
    }

    // Check if microphone permission is available
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      setError('Microphone access is required for voice search. Please allow microphone permissions.');
      return null;
    }

    setIsListening(true);
    setError(null);
    setTranscript('');

    return new Promise((resolve) => {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Voice recognition started');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          setIsListening(false);
          resolve(finalTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Speech recognition error occurred.';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was aborted.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        setError(errorMessage);
        setIsListening(false);
        resolve(null);
      };

      recognition.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
        recognitionRef.current = null;
      };

      try {
        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setError('Failed to start voice recognition. Please try again.');
        setIsListening(false);
        resolve(null);
      }
    });
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    error,
    transcript,
    clearError
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechRecognition: typeof SpeechRecognition;
  }
}
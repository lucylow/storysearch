import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  category: string;
  imageUrl?: string;
}

const LandingVoiceSearchDemo = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Mock search results for Nike sustainability
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: "Nike's Move to Zero",
      description: "Carbon neutral by 2025, 75% renewable energy in manufacturing",
      relevanceScore: 92,
      category: "Sustainability",
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: '2',
      title: "Circular Design",
      description: "Recycled materials in Air Max and Space Hippie collections",
      relevanceScore: 86,
      category: "Innovation",
      imageUrl: "/api/placeholder/300/200"
    }
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleSearch(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setTranscript('');
      setSearchResults([]);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock search logic - in real implementation, this would call Algolia
    if (query.toLowerCase().includes('nike') && query.toLowerCase().includes('sustainability')) {
      setSearchResults(mockResults);
    }
    
    setIsSearching(false);
  };

  const playTranscript = () => {
    if ('speechSynthesis' in window && transcript) {
      const utterance = new SpeechSynthesisUtterance(transcript);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Voice Search Interface */}
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-8 text-center">
          <motion.div
            animate={isListening ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
            className="mb-6"
          >
            <Button
              onClick={isListening ? stopListening : startListening}
              size="lg"
              className={`w-20 h-20 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
          </motion.div>
          
          <h3 className="text-xl font-semibold mb-2">
            {isListening ? 'Listening...' : 'Voice Search Demo'}
          </h3>
          
          <p className="text-muted-foreground mb-4">
            {isListening 
              ? 'Speak naturally about what you want to discover'
              : 'Click the microphone and say: "Tell me about Nike\'s sustainability initiatives"'
            }
          </p>

          {/* Transcript Display */}
          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 bg-background rounded-lg border"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm italic">"{transcript}"</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={playTranscript}
                    className="ml-2"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Search Results */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center space-x-2">
              <Search className="w-5 h-5 animate-spin" />
              <span>AI is analyzing your query...</span>
            </div>
          </motion.div>
        )}

        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {searchResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary">{result.category}</Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {result.relevanceScore}% relevance
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{result.title}</h4>
                    <p className="text-muted-foreground text-sm">{result.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingVoiceSearchDemo;

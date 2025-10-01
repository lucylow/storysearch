import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, Circle, Brain, Search, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface JourneyStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  content: string;
  completed: boolean;
  active: boolean;
}

const LandingDiscoveryJourney = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);

  const journeySteps: JourneyStep[] = [
    {
      id: 1,
      title: 'Understanding',
      description: 'Learning fundamentals',
      icon: Brain,
      content: 'Electric vehicles (EVs) are automobiles powered by electric motors using energy stored in rechargeable batteries. Key advantages include zero direct emissions, lower operating costs, and reduced noise pollution. The technology has evolved significantly with improvements in battery capacity, charging infrastructure, and vehicle range.',
      completed: currentStep > 1,
      active: currentStep === 1
    },
    {
      id: 2,
      title: 'Comparing',
      description: 'Analyzing options',
      icon: Search,
      content: 'Leading EV manufacturers include Tesla (Model S, 3, X, Y), BMW (i3, i4, iX), Audi (e-tron series), and Mercedes (EQS, EQC). Key comparison factors: range (200-400+ miles), charging speed (30min-8hrs), price ($30k-$100k+), and features (autopilot, luxury amenities, performance specs).',
      completed: currentStep > 2,
      active: currentStep === 2
    },
    {
      id: 3,
      title: 'Analyzing',
      description: 'Deep dive into features',
      icon: BarChart3,
      content: 'Cost analysis shows EVs have higher upfront costs but lower total cost of ownership. Charging infrastructure is expanding rapidly with 50,000+ public stations in the US. Environmental impact varies by electricity source but generally 50-70% lower carbon footprint than gas vehicles. Performance often exceeds traditional cars with instant torque.',
      completed: currentStep > 3,
      active: currentStep === 3
    },
    {
      id: 4,
      title: 'Deciding',
      description: 'Making informed choices',
      icon: Target,
      content: 'Based on your research journey, consider: Budget ($40k-60k recommended for quality options), daily driving needs (most EVs handle 200+ miles), home charging setup (Level 2 charger recommended), and local incentives (federal tax credits up to $7,500). Top recommendation: Tesla Model Y for balance of features, range, and charging network.',
      completed: currentStep > 4,
      active: currentStep === 4
    }
  ];

  const startJourney = () => {
    setIsJourneyStarted(true);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < journeySteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetJourney = () => {
    setIsJourneyStarted(false);
    setCurrentStep(1);
  };

  const progress = (currentStep / journeySteps.length) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {!isJourneyStarted ? (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Agentic Discovery Journey</CardTitle>
            <p className="text-muted-foreground">
              Experience how our AI guides you through a personalized learning journey
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">AI-Guided Learning</span>
              </div>
            </div>
            <Button onClick={startJourney} size="lg" className="px-8">
              Start Discovery Journey: "Tell me about electric vehicles"
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Progress Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Learning Journey: Electric Vehicles</h2>
                <Badge variant="outline">Step {currentStep} of {journeySteps.length}</Badge>
              </div>
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                AI is guiding you through a personalized discovery experience
              </p>
            </CardContent>
          </Card>

          {/* Journey Steps */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Steps Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Journey Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {journeySteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                        step.active 
                          ? 'bg-primary/10 border border-primary/20' 
                          : step.completed 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-500 text-white' 
                          : step.active 
                          ? 'bg-primary text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      {step.active && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-3 h-3 bg-primary rounded-full"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Current Step Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    {React.createElement(journeySteps[currentStep - 1].icon, { 
                      className: "w-5 h-5 text-white" 
                    })}
                  </div>
                  <div>
                    <CardTitle>Step {currentStep}: {journeySteps[currentStep - 1].title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {journeySteps[currentStep - 1].description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm leading-relaxed mb-6">
                      {journeySteps[currentStep - 1].content}
                    </p>
                    
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={resetJourney}
                      >
                        Start Over
                      </Button>
                      
                      {currentStep < journeySteps.length ? (
                        <Button onClick={nextStep} className="flex items-center space-x-2">
                          <span>Continue Journey</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button onClick={resetJourney} variant="default">
                          Journey Complete! Start New Topic
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingDiscoveryJourney;

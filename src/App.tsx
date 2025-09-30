import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AppPage from "./pages/AppPage";
import NotFound from "./pages/NotFound";
import AnalyticsDashboard from "./components/AIFeatures/AnalyticsDashboard";
import AIAgentsDashboard from "./components/AIFeatures/AIAgentsDashboard";
import EnhancedSearchInterface from "./components/Search/EnhancedSearchInterface";
import TestPage from "./pages/TestPage";
import DiagnosticPage from "./pages/DiagnosticPage";
import AgentStudioPage from "./pages/AgentStudioPage";
import WorkflowStudioPage from "./pages/WorkflowStudioPage";
import AIReportsPage from "./pages/AIReportsPage";
import FloatingAIChatbot from "./components/ui/FloatingAIChatbot";
import { AIContextProvider } from "./contexts/AIContext";
import { BrandProvider } from "./contexts/BrandContext";
import { AgentProvider } from "./contexts/AgentContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrandProvider>
        <AIContextProvider>
          <AgentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/app" element={<AppPage />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/ai-agents" element={<AIAgentsDashboard />} />
              <Route path="/search" element={<EnhancedSearchInterface />} />
              <Route path="/agents" element={<AgentStudioPage />} />
              <Route path="/workflows" element={<WorkflowStudioPage />} />
              <Route path="/reports" element={<AIReportsPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/diagnostic" element={<DiagnosticPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <FloatingAIChatbot />
          </AgentProvider>
        </AIContextProvider>
      </BrandProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

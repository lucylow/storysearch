import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import AppPage from "./pages/AppPage";
import NotFound from "./pages/NotFound";
import FloatingAIChatbot from "./components/ui/FloatingAIChatbot";
import MainNavigation from "./components/UI/MainNavigation";
import { AIContextProvider } from "./contexts/AIContext";
import { BrandProvider } from "./contexts/BrandContext";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy load heavy components for better performance
const AIAgentsDashboard = lazy(() => import("./components/AIFeatures/AIAgentsDashboard"));
const HackathonDemo = lazy(() => import("./pages/HackathonDemo"));
const TestPage = lazy(() => import("./pages/TestPage"));
const DiagnosticPage = lazy(() => import("./pages/DiagnosticPage"));
const AIReportsPage = lazy(() => import("./pages/AIReportsPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const ContentLibraryPage = lazy(() => import("./pages/ContentLibraryPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const DocumentationPage = lazy(() => import("./pages/DocumentationPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrandProvider>
          <AIContextProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainNavigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/app" element={<AppPage />} />
              <Route path="/ai-agents" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <AIAgentsDashboard />
                </Suspense>
              } />
              <Route path="/hackathon" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <HackathonDemo />
                </Suspense>
              } />
              <Route path="/reports" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <AIReportsPage />
                </Suspense>
              } />
              <Route path="/auth/callback" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <AuthCallbackPage />
                </Suspense>
              } />
              <Route path="/content" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <ContentLibraryPage />
                </Suspense>
              } />
              <Route path="/settings" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <SettingsPage />
                </Suspense>
              } />
              <Route path="/docs" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <DocumentationPage />
                </Suspense>
              } />
              <Route path="/test" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <TestPage />
                </Suspense>
              } />
              <Route path="/diagnostic" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <DiagnosticPage />
                </Suspense>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <FloatingAIChatbot />
          </AIContextProvider>
        </BrandProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

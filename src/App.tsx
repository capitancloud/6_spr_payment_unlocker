/**
 * 🏠 APP PRINCIPALE - Payment Unlocker
 * 
 * Routing e layout dell'applicazione educativa.
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import PaymentFlowPage from "./pages/PaymentFlowPage";
import WebhooksPage from "./pages/WebhooksPage";
import PricingPage from "./pages/PricingPage";
import FeaturesPage from "./pages/FeaturesPage";
import CodePage from "./pages/CodePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

// Componente che gestisce le route protette
function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostra un loading state mentre verifica l'auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Caricamento...</div>
      </div>
    );
  }

  // Se non autenticato, mostra la pagina di login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Se autenticato, mostra l'app
  return (
    <PaymentProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment-flow" element={<PaymentFlowPage />} />
          <Route path="/webhooks" element={<WebhooksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/code" element={<CodePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </PaymentProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

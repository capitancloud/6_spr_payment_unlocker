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
import { MainLayout } from "@/components/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import PaymentFlowPage from "./pages/PaymentFlowPage";
import WebhooksPage from "./pages/WebhooksPage";
import PricingPage from "./pages/PricingPage";
import FeaturesPage from "./pages/FeaturesPage";
import CodePage from "./pages/CodePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

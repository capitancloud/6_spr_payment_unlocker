/**
 * 🏠 PAGINA PRINCIPALE - Payment Unlocker
 * 
 * Questa è la pagina principale dell'app educativa.
 * Compone insieme tutti i componenti per creare un'esperienza
 * di apprendimento completa sui pagamenti online.
 */

import { useRef } from 'react';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { HeroSection } from '@/components/HeroSection';
import { PaymentFlowDiagram } from '@/components/PaymentFlowDiagram';
import { WebhookExplainer } from '@/components/WebhookExplainer';
import { PricingPlans } from '@/components/PricingPlans';
import { PremiumFeatures } from '@/components/PremiumFeatures';
import { CodeExplanation } from '@/components/CodeExplanation';
import { Footer } from '@/components/Footer';

const Index = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PaymentProvider>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroSection onStartLearning={scrollToContent} />
        
        {/* Main Content */}
        <div ref={mainContentRef}>
          {/* Diagramma del flusso di pagamento */}
          <PaymentFlowDiagram />
          
          {/* Spiegazione dei webhook */}
          <WebhookExplainer />
          
          {/* Piani e simulazione checkout */}
          <PricingPlans />
          
          {/* Funzionalità premium con paywall */}
          <PremiumFeatures />
          
          {/* Spiegazioni del codice */}
          <CodeExplanation />
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </PaymentProvider>
  );
};

export default Index;

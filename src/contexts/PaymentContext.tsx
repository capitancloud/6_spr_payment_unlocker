/**
 * 📚 CONTESTO DEI PAGAMENTI - PaymentContext
 * 
 * Questo contesto React gestisce lo stato dell'abbonamento dell'utente.
 * In un'app reale, questo stato verrebbe sincronizzato con il database
 * tramite i webhook di Stripe.
 * 
 * CONCETTI CHIAVE:
 * - Context API: Permette di condividere lo stato tra componenti
 * - Subscription State: Traccia se l'utente è free o premium
 * - Simulazione: Qui simuliamo il cambio di piano senza backend reale
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definizione dei tipi per TypeScript
export type PlanType = 'free' | 'premium';

export interface PaymentState {
  plan: PlanType;
  isProcessing: boolean;
  lastPaymentDate: Date | null;
  subscriptionId: string | null;
}

interface PaymentContextType {
  state: PaymentState;
  upgradeToPremium: () => Promise<void>;
  downgradeToFree: () => void;
  simulateWebhook: (event: string) => void;
}

// Creazione del Context con valore di default undefined
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

/**
 * Provider del contesto pagamenti
 * Avvolge l'app e fornisce lo stato dei pagamenti a tutti i componenti figli
 */
export function PaymentProvider({ children }: { children: ReactNode }) {
  // Stato iniziale: utente con piano gratuito
  const [state, setState] = useState<PaymentState>({
    plan: 'free',
    isProcessing: false,
    lastPaymentDate: null,
    subscriptionId: null,
  });

  /**
   * 🎯 SIMULAZIONE UPGRADE A PREMIUM
   * 
   * In un'app reale, questa funzione:
   * 1. Chiama l'API Stripe per creare una sessione di checkout
   * 2. Reindirizza l'utente al checkout Stripe
   * 3. Stripe invia un webhook dopo il pagamento
   * 4. Il webhook aggiorna il database
   * 5. L'app legge lo stato aggiornato dal database
   * 
   * Qui simuliamo tutto questo processo con un delay
   */
  const upgradeToPremium = async () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    // Simula il tempo di elaborazione del pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setState({
      plan: 'premium',
      isProcessing: false,
      lastPaymentDate: new Date(),
      subscriptionId: `sub_simulated_${Date.now()}`,
    });
  };

  /**
   * 🔄 DOWNGRADE A FREE
   * In produzione, questo verrebbe gestito da un webhook
   * quando l'abbonamento viene cancellato o scade
   */
  const downgradeToFree = () => {
    setState({
      plan: 'free',
      isProcessing: false,
      lastPaymentDate: null,
      subscriptionId: null,
    });
  };

  /**
   * 🔔 SIMULAZIONE WEBHOOK
   * I webhook sono chiamate HTTP che Stripe invia al tuo server
   * per notificare eventi importanti come pagamenti riusciti,
   * falliti, cancellazioni, ecc.
   */
  const simulateWebhook = (event: string) => {
    console.log(`🔔 Webhook ricevuto: ${event}`);
    
    switch (event) {
      case 'checkout.session.completed':
        setState(prev => ({
          ...prev,
          plan: 'premium',
          lastPaymentDate: new Date(),
        }));
        break;
      case 'customer.subscription.deleted':
        setState(prev => ({
          ...prev,
          plan: 'free',
          subscriptionId: null,
        }));
        break;
      case 'invoice.payment_failed':
        console.log('⚠️ Pagamento fallito - inviare notifica utente');
        break;
    }
  };

  return (
    <PaymentContext.Provider value={{ state, upgradeToPremium, downgradeToFree, simulateWebhook }}>
      {children}
    </PaymentContext.Provider>
  );
}

/**
 * Hook personalizzato per accedere al contesto dei pagamenti
 * Uso: const { state, upgradeToPremium } = usePayment();
 */
export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment deve essere usato dentro PaymentProvider');
  }
  return context;
}

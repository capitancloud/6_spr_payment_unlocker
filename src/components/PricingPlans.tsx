/**
 * 💳 PIANI E PREZZI
 * 
 * Questo componente mostra i piani disponibili e gestisce
 * la simulazione del checkout Stripe.
 * 
 * NOTA EDUCATIVA:
 * In un'app reale, cliccando su "Abbonati":
 * 1. Si chiama un endpoint API del backend
 * 2. Il backend crea una sessione di checkout Stripe
 * 3. L'utente viene reindirizzato al checkout Stripe
 * 4. Dopo il pagamento, Stripe invia un webhook
 * 5. Il webhook aggiorna il database
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Star, Loader2, CreditCard, ArrowRight, XCircle, Zap, Database, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePayment } from '@/contexts/PaymentContext';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    period: 'per sempre',
    description: 'Perfetto per iniziare a esplorare',
    features: [
      'Accesso alla documentazione base',
      'Visualizzazione diagrammi',
      'Community forum',
      'Tutorial introduttivi',
    ],
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    period: '/ mese',
    description: 'Sblocca tutto il potenziale educativo',
    features: [
      'Tutto del piano Gratuito',
      'Simulazioni interattive complete',
      'Codice sorgente scaricabile',
      'Quiz e certificazioni',
      'Progetti pratici guidati',
      'Supporto prioritario',
    ],
    highlighted: true,
  },
];

export function PricingPlans() {
  const { state, upgradeToPremium, downgradeToFree } = usePayment();
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCancellation, setShowCancellation] = useState(false);
  const [cancellationStep, setCancellationStep] = useState(0);

  const handleSubscribe = async () => {
    setShowCheckout(true);
    setCheckoutStep(1);
    
    // Simula i passi del checkout
    const steps = [
      { step: 1, delay: 1000 }, // Creazione sessione
      { step: 2, delay: 1500 }, // Redirect a Stripe
      { step: 3, delay: 2000 }, // Elaborazione pagamento
      { step: 4, delay: 1000 }, // Webhook ricevuto
    ];
    
    for (const { step, delay } of steps) {
      await new Promise(resolve => setTimeout(resolve, delay));
      setCheckoutStep(step);
    }
    
    await upgradeToPremium();
    setCheckoutStep(5);
    
    setTimeout(() => {
      setShowCheckout(false);
      setCheckoutStep(0);
    }, 2000);
  };

  const handleCancellation = async () => {
    setShowCancellation(true);
    setCancellationStep(1);
    
    // Simula i passi della cancellazione
    const steps = [
      { step: 1, delay: 1500 }, // Richiesta cancellazione
      { step: 2, delay: 1500 }, // Stripe processa
      { step: 3, delay: 1500 }, // Webhook customer.subscription.deleted
      { step: 4, delay: 1500 }, // Database aggiornato
    ];
    
    for (const { step, delay } of steps) {
      await new Promise(resolve => setTimeout(resolve, delay));
      setCancellationStep(step);
    }
    
    downgradeToFree();
    setCancellationStep(5);
    
    setTimeout(() => {
      setShowCancellation(false);
      setCancellationStep(0);
    }, 2000);
  };

  return (
    <section className="py-20 bg-muted/30" id="pricing">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            {state.plan === 'premium' ? '👑 Sei Premium!' : '💡 Prova la Simulazione'}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Scegli il Tuo Piano
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Questa è una <strong>simulazione educativa</strong>. Nessun pagamento reale verrà effettuato!
          </p>
        </motion.div>

        {/* Cards dei piani */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card 
                className={`relative h-full ${
                  plan.highlighted 
                    ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                    : ''
                } ${
                  state.plan === plan.id 
                    ? 'bg-accent/5 border-accent' 
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-premium text-foreground font-semibold shadow-lg">
                      <Star className="w-4 h-4 mr-1" />
                      Più Popolare
                    </Badge>
                  </div>
                )}

                {state.plan === plan.id && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-accent text-accent-foreground">
                      <Check className="w-4 h-4 mr-1" />
                      Piano Attivo
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                    {plan.id === 'premium' ? (
                      <Crown className="w-8 h-8 text-primary" />
                    ) : (
                      <Star className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="pt-4">
                  {/* Prezzo */}
                  <div className="text-center mb-6">
                    <span className="text-5xl font-bold">
                      {plan.price === 0 ? 'Gratis' : `€${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {plan.id === 'premium' ? (
                    state.plan === 'premium' ? (
                      <Button 
                        variant="outline" 
                        className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={handleCancellation}
                        disabled={showCancellation}
                      >
                        {showCancellation ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cancellazione...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancella Abbonamento
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-gradient-premium text-foreground hover:opacity-90"
                        onClick={handleSubscribe}
                        disabled={showCheckout}
                      >
                        {showCheckout ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Elaborazione...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Simula Abbonamento
                          </>
                        )}
                      </Button>
                    )
                  ) : (
                    state.plan === 'premium' ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleCancellation}
                        disabled={showCancellation}
                      >
                        {showCancellation ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Downgrade...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Passa a Gratuito
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Piano Attuale
                      </Button>
                    )
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Checkout Simulation Modal */}
        <AnimatePresence>
          {showCheckout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="text-center">
                      🔄 Simulazione Checkout
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { step: 1, label: 'Creazione sessione Stripe...', icon: CreditCard },
                        { step: 2, label: 'Redirect al checkout Stripe...', icon: ArrowRight },
                        { step: 3, label: 'Elaborazione pagamento...', icon: Loader2 },
                        { step: 4, label: 'Ricezione webhook...', icon: Check },
                        { step: 5, label: 'Piano Premium attivato! 🎉', icon: Crown },
                      ].map((item) => (
                        <motion.div
                          key={item.step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: checkoutStep >= item.step ? 1 : 0.3,
                            x: 0 
                          }}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            checkoutStep === item.step 
                              ? 'bg-primary/10' 
                              : checkoutStep > item.step 
                              ? 'bg-accent/10' 
                              : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            checkoutStep > item.step 
                              ? 'bg-accent text-accent-foreground' 
                              : checkoutStep === item.step
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            {checkoutStep > item.step ? (
                              <Check className="w-4 h-4" />
                            ) : checkoutStep === item.step && item.step !== 5 ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <item.icon className="w-4 h-4" />
                            )}
                          </div>
                          <span className={checkoutStep >= item.step ? 'font-medium' : 'text-muted-foreground'}>
                            {item.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cancellation Simulation Modal */}
        <AnimatePresence>
          {showCancellation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="text-center">
                      🔄 Simulazione Cancellazione
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center">
                      Ecco cosa succede quando un utente cancella l'abbonamento
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { step: 1, label: 'Richiesta cancellazione a Stripe...', icon: XCircle, desc: 'Il frontend chiama il backend' },
                        { step: 2, label: 'Stripe elabora la cancellazione...', icon: CreditCard, desc: 'subscription.cancel()' },
                        { step: 3, label: 'Webhook: subscription.deleted', icon: Zap, desc: 'Stripe notifica il server' },
                        { step: 4, label: 'Database aggiornato', icon: Database, desc: "plan = 'free'" },
                        { step: 5, label: 'Abbonamento cancellato! 👋', icon: AlertTriangle, desc: 'Accesso premium revocato' },
                      ].map((item) => (
                        <motion.div
                          key={item.step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: cancellationStep >= item.step ? 1 : 0.3,
                            x: 0 
                          }}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            cancellationStep === item.step 
                              ? 'bg-destructive/10' 
                              : cancellationStep > item.step 
                              ? 'bg-muted/50' 
                              : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            cancellationStep > item.step 
                              ? 'bg-muted text-muted-foreground' 
                              : cancellationStep === item.step
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-muted'
                          }`}>
                            {cancellationStep > item.step ? (
                              <Check className="w-4 h-4" />
                            ) : cancellationStep === item.step && item.step !== 5 ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <item.icon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={cancellationStep >= item.step ? 'font-medium block' : 'text-muted-foreground block'}>
                              {item.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.desc}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Codice esempio */}
                    {cancellationStep >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <pre className="bg-code-bg text-code-text p-3 rounded-lg text-xs overflow-x-auto">
                          <code>{`// Webhook: customer.subscription.deleted
{
  "type": "customer.subscription.deleted",
  "data": {
    "object": {
      "id": "sub_xxx",
      "status": "canceled"
    }
  }
}`}</code>
                        </pre>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

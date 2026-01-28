/**
 * 📊 DIAGRAMMA DEL FLUSSO DI PAGAMENTO
 * 
 * Questo componente visualizza in modo interattivo come funziona
 * il flusso di pagamento con Stripe, passo dopo passo.
 * 
 * FASI DEL FLUSSO:
 * 1. L'utente clicca "Abbonati"
 * 2. Il frontend chiama il backend
 * 3. Il backend crea una sessione Stripe
 * 4. L'utente viene reindirizzato al checkout Stripe
 * 5. L'utente inserisce i dati della carta
 * 6. Stripe elabora il pagamento
 * 7. Stripe invia un webhook al backend
 * 8. Il backend aggiorna il database
 * 9. L'utente è ora premium!
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Server, CreditCard, Database, CheckCircle, 
  ArrowRight, Play, RotateCcw, Zap, Pause, SkipForward, SkipBack
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: typeof User;
  actor: 'user' | 'frontend' | 'backend' | 'stripe' | 'webhook';
  code?: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Utente clicca 'Abbonati'",
    description: "L'utente decide di passare al piano Premium e clicca il pulsante di abbonamento.",
    icon: User,
    actor: 'user',
    code: `// Nel componente React
<Button onClick={handleSubscribe}>
  Abbonati a Premium
</Button>`
  },
  {
    id: 2,
    title: "Richiesta al Backend",
    description: "Il frontend invia una richiesta API al tuo server per creare una sessione di checkout.",
    icon: Server,
    actor: 'frontend',
    code: `// Chiamata API dal frontend
const response = await fetch('/api/create-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    priceId: 'price_premium_monthly',
    userId: currentUser.id 
  })
});`
  },
  {
    id: 3,
    title: "Creazione Sessione Stripe",
    description: "Il backend usa l'SDK di Stripe per creare una sessione di checkout con i dettagli del piano.",
    icon: CreditCard,
    actor: 'backend',
    code: `// Nel backend (Node.js)
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  payment_method_types: ['card'],
  line_items: [{
    price: 'price_premium_monthly',
    quantity: 1,
  }],
  success_url: 'https://tuosite.com/success',
  cancel_url: 'https://tuosite.com/cancel',
  customer_email: user.email,
  metadata: { userId: user.id }
});`
  },
  {
    id: 4,
    title: "Redirect al Checkout",
    description: "L'utente viene reindirizzato alla pagina di checkout sicura di Stripe.",
    icon: CreditCard,
    actor: 'stripe',
    code: `// Reindirizzamento a Stripe
window.location.href = session.url;

// Oppure con Stripe.js
const stripe = await loadStripe('pk_test_xxx');
stripe.redirectToCheckout({ 
  sessionId: session.id 
});`
  },
  {
    id: 5,
    title: "Pagamento Elaborato",
    description: "Stripe elabora il pagamento in modo sicuro. I dati della carta non passano mai dal tuo server!",
    icon: CheckCircle,
    actor: 'stripe',
    code: `// Stripe gestisce tutto automaticamente:
// ✅ Validazione carta
// ✅ 3D Secure se richiesto
// ✅ Gestione errori
// ✅ Prevenzione frodi`
  },
  {
    id: 6,
    title: "Webhook Inviato",
    description: "Stripe invia un webhook al tuo server con i dettagli del pagamento riuscito.",
    icon: Zap,
    actor: 'webhook',
    code: `// Stripe invia un POST a /webhook
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_xxx",
      "customer": "cus_xxx",
      "subscription": "sub_xxx",
      "metadata": { "userId": "123" }
    }
  }
}`
  },
  {
    id: 7,
    title: "Database Aggiornato",
    description: "Il backend riceve il webhook, lo verifica e aggiorna il database con lo stato premium.",
    icon: Database,
    actor: 'backend',
    code: `// Handler del webhook
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body, sig, webhookSecret
  );
  
  if (event.type === 'checkout.session.completed') {
    const userId = event.data.object.metadata.userId;
    await db.users.update({
      where: { id: userId },
      data: { plan: 'premium' }
    });
  }
  
  res.json({ received: true });
});`
  },
  {
    id: 8,
    title: "Utente Premium! 🎉",
    description: "L'utente ora ha accesso a tutte le funzionalità premium. L'app legge lo stato dal database.",
    icon: CheckCircle,
    actor: 'user',
    code: `// L'app controlla lo stato dell'utente
const { data: user } = await supabase
  .from('users')
  .select('plan')
  .single();

if (user.plan === 'premium') {
  // Mostra funzionalità premium
  showPremiumFeatures();
}`
  }
];

const actorColors = {
  user: 'bg-primary text-primary-foreground',
  frontend: 'bg-secondary text-secondary-foreground',
  backend: 'bg-accent text-accent-foreground',
  stripe: 'bg-gradient-premium text-foreground',
  webhook: 'bg-warning text-warning-foreground',
};

const actorLabels = {
  user: 'Utente',
  frontend: 'Frontend',
  backend: 'Backend',
  stripe: 'Stripe',
  webhook: 'Webhook',
};

// Durata di ogni step in millisecondi
const STEP_DURATION = 4000;

export function PaymentFlowDiagram() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup degli intervalli
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Gestione dell'autoplay
  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      // Reset progress bar
      setProgress(0);
      
      // Progress bar animation (aggiorna ogni 50ms)
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (STEP_DURATION / 50));
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 50);

      // Avanza allo step successivo dopo STEP_DURATION
      intervalRef.current = setTimeout(() => {
        if (currentStep < steps.length) {
          setCurrentStep(prev => prev + 1);
          setProgress(0);
        }
        if (currentStep >= steps.length - 1) {
          setIsPlaying(false);
        }
      }, STEP_DURATION);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, currentStep]);

  const playAnimation = () => {
    if (currentStep >= steps.length) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const nextStep = () => {
    pauseAnimation();
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  };

  const prevStep = () => {
    pauseAnimation();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setProgress(0);
    }
  };

  const goToStep = (stepIndex: number) => {
    pauseAnimation();
    setCurrentStep(stepIndex + 1);
    setProgress(0);
  };

  const reset = () => {
    pauseAnimation();
    setCurrentStep(0);
    setProgress(0);
  };

  return (
    <section className="py-20 bg-muted/30" id="payment-flow">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            📊 Flusso di Pagamento Stripe
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Segui il percorso completo di un pagamento, dal click dell'utente 
            fino all'attivazione del piano premium.
          </p>
        </motion.div>

        {/* Controlli */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button 
            variant="outline"
            onClick={prevStep} 
            disabled={currentStep === 0}
            size="lg"
          >
            <SkipBack className="w-4 h-4 mr-2" />
            Precedente
          </Button>
          
          {isPlaying ? (
            <Button 
              onClick={pauseAnimation}
              size="lg"
              variant="secondary"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pausa
            </Button>
          ) : (
            <Button 
              onClick={playAnimation}
              size="lg"
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              {currentStep === 0 ? 'Avvia Simulazione' : 'Continua'}
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={nextStep} 
            disabled={currentStep >= steps.length}
            size="lg"
          >
            Successivo
            <SkipForward className="w-4 h-4 ml-2" />
          </Button>
          
          <Button variant="ghost" onClick={reset} size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Progress bar globale */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {Math.min(currentStep, steps.length)} di {steps.length}</span>
            <span>{currentStep >= steps.length ? 'Completato!' : isPlaying ? 'In corso...' : 'In pausa'}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentStep - 1 + progress / 100) / steps.length) * 100}%` 
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Step progress indicator (cliccabili) */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-sm font-medium ${
                currentStep > index 
                  ? 'bg-accent text-accent-foreground scale-100' 
                  : currentStep === index + 1
                  ? `${actorColors[step.actor]} scale-110 ring-4 ring-primary/30`
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              title={step.title}
            >
              {currentStep > index ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>

        {/* Step timer bar */}
        {isPlaying && currentStep > 0 && currentStep <= steps.length && (
          <div className="max-w-md mx-auto mb-8">
            <Progress value={progress} className="h-1" />
          </div>
        )}

        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(actorLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${actorColors[key as keyof typeof actorColors]}`} />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Linea di connessione */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-start gap-4 mb-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Icona Step */}
              <button 
                onClick={() => goToStep(index)}
                className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-105 ${
                  currentStep > index 
                    ? 'bg-accent text-accent-foreground scale-110' 
                    : currentStep === index + 1
                    ? `${actorColors[step.actor]} scale-110 animate-pulse-glow`
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {currentStep > index ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <step.icon className="w-8 h-8" />
                )}
              </button>

              {/* Contenuto */}
              <Card 
                className={`flex-1 p-6 transition-all duration-500 cursor-pointer hover:shadow-lg ${
                  currentStep > index ? 'opacity-100' : currentStep === index + 1 ? 'opacity-100' : 'opacity-50'
                } ${currentStep === index + 1 ? 'ring-2 ring-primary shadow-lg' : ''}`}
                onClick={() => goToStep(index)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${actorColors[step.actor]}`}>
                    {actorLabels[step.actor]}
                  </span>
                  <span className="text-sm text-muted-foreground">Step {step.id}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                
                {/* Code snippet */}
                {step.code && (
                  <AnimatePresence>
                    {currentStep >= index + 1 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <pre className="bg-code-bg text-code-text p-4 rounded-lg text-xs overflow-x-auto">
                          <code>{step.code}</code>
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Messaggio finale */}
        <AnimatePresence>
          {currentStep >= steps.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center mt-12"
            >
              <Card className="inline-block p-8 bg-accent/10 border-accent">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-accent">
                  🎉 Flusso Completato!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Hai visto tutto il percorso di un pagamento Stripe. 
                  Clicca Reset per rivederlo!
                </p>
                <Button onClick={reset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Rivedi il Flusso
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

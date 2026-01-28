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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Server, CreditCard, Database, CheckCircle, 
  ArrowRight, Play, RotateCcw, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

export function PaymentFlowDiagram() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAnimation = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    for (let i = 0; i <= steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(i);
    }
    
    setIsPlaying(false);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
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
        <div className="flex justify-center gap-4 mb-12">
          <Button 
            onClick={playAnimation} 
            disabled={isPlaying}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isPlaying ? 'In esecuzione...' : 'Avvia Simulazione'}
          </Button>
          <Button variant="outline" onClick={reset} disabled={isPlaying}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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
              <div 
                className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStep > index 
                    ? 'bg-accent text-accent-foreground scale-110' 
                    : currentStep === index
                    ? `${actorColors[step.actor]} scale-110 animate-pulse-glow`
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > index ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <step.icon className="w-8 h-8" />
                )}
              </div>

              {/* Contenuto */}
              <Card className={`flex-1 p-6 transition-all duration-500 ${
                currentStep >= index ? 'opacity-100' : 'opacity-50'
              } ${currentStep === index ? 'ring-2 ring-primary shadow-lg' : ''}`}>
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
                    {currentStep >= index && (
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
      </div>
    </section>
  );
}

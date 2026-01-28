/**
 * 📖 SPIEGAZIONE DEL CODICE
 * 
 * Sezione che mostra i concetti chiave del codice
 * con spiegazioni dettagliate per principianti.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, BookOpen, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CodeConcept {
  id: string;
  title: string;
  category: string;
  explanation: string;
  code: string;
  tips: string[];
}

const concepts: CodeConcept[] = [
  {
    id: 'checkout-session',
    title: 'Creare una Sessione di Checkout',
    category: 'Backend',
    explanation: `La sessione di checkout è il modo più semplice per integrare Stripe. 
    Crea una pagina di pagamento ospitata da Stripe, così non devi gestire i dati sensibili delle carte.`,
    code: `// Nel tuo backend (Node.js + Express)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    // Tipo di pagamento: 'subscription' per abbonamenti
    mode: 'subscription',
    
    // Metodi di pagamento accettati
    payment_method_types: ['card'],
    
    // Prodotti da acquistare
    line_items: [{
      price: 'price_xxxxx', // ID del prezzo creato in Stripe
      quantity: 1,
    }],
    
    // URL di redirect dopo il pagamento
    success_url: 'https://tuosite.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://tuosite.com/cancel',
    
    // Dati personalizzati per identificare l'utente
    metadata: {
      userId: req.body.userId
    }
  });
  
  res.json({ url: session.url });
});`,
    tips: [
      'Usa sempre variabili d\'ambiente per le chiavi API',
      'Il price ID lo trovi nella dashboard Stripe',
      'I metadata sono fondamentali per collegare il pagamento all\'utente',
    ],
  },
  {
    id: 'webhook-handler',
    title: 'Gestire i Webhook',
    category: 'Backend',
    explanation: `I webhook sono notifiche HTTP che Stripe invia al tuo server quando avvengono eventi. 
    Sono essenziali perché il pagamento può completarsi anche quando l'utente non è sul tuo sito.`,
    code: `// Handler webhook (Express)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    // ⚠️ Verifica SEMPRE la firma!
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }
  
  // Gestisci i diversi eventi
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Attiva il premium per l'utente
      await activatePremium(session.metadata.userId);
      break;
      
    case 'invoice.payment_failed':
      // Notifica l'utente del pagamento fallito
      await notifyUser(event.data.object.customer);
      break;
  }
  
  res.json({ received: true });
});`,
    tips: [
      'La firma del webhook previene attacchi di spoofing',
      'Rispondi sempre con 200, altrimenti Stripe riproverà',
      'Stripe riprova automaticamente in caso di errori',
    ],
  },
  {
    id: 'frontend-redirect',
    title: 'Redirect al Checkout (Frontend)',
    category: 'Frontend',
    explanation: `Dal frontend, devi chiamare il backend per creare la sessione e poi 
    reindirizzare l'utente alla pagina di checkout Stripe.`,
    code: `// Nel componente React
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_xxxxx');

function SubscribeButton() {
  const handleSubscribe = async () => {
    // 1. Chiama il tuo backend
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    });
    
    const { url } = await response.json();
    
    // 2. Reindirizza a Stripe
    window.location.href = url;
    
    // Oppure usa Stripe.js per maggiore controllo
    // const stripe = await stripePromise;
    // stripe.redirectToCheckout({ sessionId });
  };
  
  return (
    <button onClick={handleSubscribe}>
      Abbonati a Premium
    </button>
  );
}`,
    tips: [
      'Usa la chiave pubblica (pk_) nel frontend',
      'La chiave segreta (sk_) va SOLO nel backend',
      'window.location.href è il modo più semplice per il redirect',
    ],
  },
  {
    id: 'check-subscription',
    title: 'Verificare lo Stato Premium',
    category: 'Frontend + Backend',
    explanation: `Dopo che il webhook ha aggiornato il database, l'app deve leggere 
    lo stato dell'utente per mostrare o nascondere le funzionalità premium.`,
    code: `// Nel componente React (con Supabase come esempio)
function useSubscription() {
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    async function checkSubscription() {
      // Leggi lo stato dal database
      const { data: user } = await supabase
        .from('users')
        .select('subscription_status, plan')
        .eq('id', currentUser.id)
        .single();
      
      setIsPremium(user?.plan === 'premium');
    }
    
    checkSubscription();
    
    // Opzionale: ascolta cambiamenti in tempo reale
    const subscription = supabase
      .channel('user_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'users' },
        (payload) => {
          setIsPremium(payload.new.plan === 'premium');
        }
      )
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, []);
  
  return isPremium;
}`,
    tips: [
      'Mai fidarsi solo del localStorage per lo stato premium',
      'Il database è la fonte di verità',
      'Usa real-time updates per UX migliore',
    ],
  },
];

export function CodeExplanation() {
  const [openItems, setOpenItems] = useState<string[]>([concepts[0].id]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-muted/30" id="code">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Code2 className="w-4 h-4 mr-1" />
            Impara dal Codice
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            📖 Spiegazioni del Codice
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Esplora i concetti chiave con esempi di codice commentati e consigli pratici.
          </p>
        </motion.div>

        {/* Concepts */}
        <div className="max-w-4xl mx-auto space-y-4">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Collapsible
                open={openItems.includes(concept.id)}
                onOpenChange={() => toggleItem(concept.id)}
              >
                <Card className="overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Code2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <CardTitle className="text-lg">{concept.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {concept.category}
                          </Badge>
                        </div>
                      </div>
                      {openItems.includes(concept.id) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {/* Spiegazione */}
                      <div className="mb-6 p-4 bg-primary/5 rounded-lg flex gap-3">
                        <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <p className="text-muted-foreground">{concept.explanation}</p>
                      </div>

                      {/* Codice */}
                      <pre className="bg-code-bg text-code-text p-4 rounded-lg text-sm overflow-x-auto mb-6">
                        <code>{concept.code}</code>
                      </pre>

                      {/* Tips */}
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-warning" />
                          Consigli Pratici
                        </h4>
                        <ul className="space-y-2">
                          {concept.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-accent">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

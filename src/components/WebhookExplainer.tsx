/**
 * 🔔 SPIEGAZIONE DEI WEBHOOK
 * 
 * I webhook sono il cuore della comunicazione asincrona tra Stripe e il tuo server.
 * Questo componente spiega perché sono essenziali.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Server, AlertTriangle, CheckCircle2, 
  RefreshCw, Shield, Clock, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WebhookEvent {
  id: string;
  type: string;
  description: string;
  importance: 'critical' | 'important' | 'info';
}

const webhookEvents: WebhookEvent[] = [
  {
    id: '1',
    type: 'checkout.session.completed',
    description: 'Il pagamento è andato a buon fine. Attiva il piano premium!',
    importance: 'critical',
  },
  {
    id: '2',
    type: 'invoice.payment_succeeded',
    description: 'Rinnovo automatico riuscito. L\'abbonamento continua.',
    importance: 'critical',
  },
  {
    id: '3',
    type: 'invoice.payment_failed',
    description: 'Pagamento fallito. Notifica l\'utente e riprova.',
    importance: 'critical',
  },
  {
    id: '4',
    type: 'customer.subscription.deleted',
    description: 'Abbonamento cancellato. Rimuovi accesso premium.',
    importance: 'critical',
  },
  {
    id: '5',
    type: 'customer.subscription.updated',
    description: 'Piano cambiato (upgrade/downgrade).',
    importance: 'important',
  },
  {
    id: '6',
    type: 'customer.created',
    description: 'Nuovo cliente creato in Stripe.',
    importance: 'info',
  },
];

const importanceColors = {
  critical: 'bg-destructive text-destructive-foreground',
  important: 'bg-warning text-warning-foreground',
  info: 'bg-primary text-primary-foreground',
};

export function WebhookExplainer() {
  const [simulatedEvents, setSimulatedEvents] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateWebhook = async (eventType: string) => {
    setIsSimulating(true);
    
    // Simula la ricezione del webhook
    await new Promise(resolve => setTimeout(resolve, 800));
    setSimulatedEvents(prev => [...prev, eventType]);
    
    setIsSimulating(false);
  };

  return (
    <section className="py-20 bg-background" id="webhooks">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🔔 Perché i Webhook sono Essenziali?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            I webhook permettono a Stripe di notificare il tuo server quando 
            avvengono eventi importanti, anche quando l'utente non è sul tuo sito.
          </p>
        </motion.div>

        {/* Spiegazione visiva */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Perché servono */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                  Senza Webhook: Problemi! ❌
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Se ti affidi solo alla redirect dopo il pagamento:
                </p>
                <ul className="space-y-3">
                  {[
                    'L\'utente chiude il browser prima della redirect',
                    'Problemi di rete interrompono la connessione',
                    'Il pagamento viene processato dopo la redirect',
                    'Rinnovi automatici senza l\'utente presente',
                    'Cancellazioni fatte dalla dashboard Stripe',
                  ].map((problem, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-destructive"
                    >
                      <span className="mt-1">✗</span>
                      <span>{problem}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Con i webhook */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                  Con Webhook: Tutto Funziona! ✅
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  I webhook garantiscono che il tuo sistema sia sempre sincronizzato:
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: Shield, text: 'Comunicazione sicura e verificata' },
                    { icon: RefreshCw, text: 'Retry automatico in caso di errori' },
                    { icon: Clock, text: 'Notifiche in tempo reale' },
                    { icon: MessageSquare, text: 'Gestione eventi anche offline' },
                    { icon: Zap, text: 'Automazione completa del flusso' },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-accent"
                    >
                      <item.icon className="w-5 h-5 mt-0.5" />
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Eventi Webhook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Eventi Webhook più Comuni
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {webhookEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    simulatedEvents.includes(event.type) 
                      ? 'ring-2 ring-accent bg-accent/5' 
                      : ''
                  }`}
                  onClick={() => simulateWebhook(event.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <code className="text-sm font-mono text-primary">
                        {event.type}
                      </code>
                      <Badge className={importanceColors[event.importance]}>
                        {event.importance === 'critical' ? '🔴' : event.importance === 'important' ? '🟠' : '🔵'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <AnimatePresence>
                      {simulatedEvents.includes(event.type) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t flex items-center gap-2 text-accent"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm">Webhook ricevuto!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setSimulatedEvents([])}
              disabled={simulatedEvents.length === 0}
            >
              Reset Simulazione
            </Button>
          </div>
        </motion.div>

        {/* Codice esempio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-code-bg text-code-text overflow-hidden">
            <CardHeader>
              <CardTitle className="text-code-text flex items-center gap-2">
                <Server className="w-5 h-5" />
                Esempio: Handler Webhook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm overflow-x-auto">
                <code>{`// Endpoint webhook nel tuo backend (Express/Node.js)
app.post('/webhook/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    // ⚠️ IMPORTANTE: Verifica sempre la firma del webhook!
    // Questo previene attacchi di spoofing
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send('Webhook Error');
  }
  
  // 📬 Gestisci i diversi tipi di eventi
  switch (event.type) {
    case 'checkout.session.completed':
      // ✅ Pagamento riuscito - attiva il piano premium
      const session = event.data.object;
      await activatePremium(session.metadata.userId);
      break;
      
    case 'invoice.payment_failed':
      // ⚠️ Pagamento fallito - notifica l'utente
      await notifyPaymentFailed(session.customer);
      break;
      
    case 'customer.subscription.deleted':
      // 🔒 Abbonamento cancellato - rimuovi accesso
      await revokePremiumAccess(session.customer);
      break;
  }
  
  // 👍 Rispondi sempre con 200 per confermare la ricezione
  res.json({ received: true });
});`}</code>
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

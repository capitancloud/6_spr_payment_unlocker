/**
 * 🔔 SPIEGAZIONE DEI WEBHOOK - Versione Avanzata
 * 
 * I webhook sono il cuore della comunicazione asincrona tra Stripe e il tuo server.
 * Questo componente spiega perché sono essenziali con simulazioni interattive.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Server, AlertTriangle, CheckCircle2, 
  RefreshCw, Shield, Clock, MessageSquare,
  ArrowRight, Database, User, CreditCard,
  Play, RotateCcw, Eye, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface WebhookEvent {
  id: string;
  type: string;
  description: string;
  importance: 'critical' | 'important' | 'info';
  payload: object;
  action: string;
  consequence: string;
}

const webhookEvents: WebhookEvent[] = [
  {
    id: '1',
    type: 'checkout.session.completed',
    description: 'Il pagamento è andato a buon fine. Attiva il piano premium!',
    importance: 'critical',
    payload: {
      id: "evt_1234567890",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_xxxxx",
          customer: "cus_xxxxx",
          customer_email: "mario@example.com",
          subscription: "sub_xxxxx",
          payment_status: "paid",
          metadata: { userId: "user_123" }
        }
      }
    },
    action: "UPDATE users SET plan = 'premium' WHERE id = metadata.userId",
    consequence: "L'utente ora ha accesso a tutte le funzionalità premium!"
  },
  {
    id: '2',
    type: 'invoice.payment_succeeded',
    description: 'Rinnovo automatico riuscito. L\'abbonamento continua.',
    importance: 'critical',
    payload: {
      id: "evt_9876543210",
      type: "invoice.payment_succeeded",
      data: {
        object: {
          id: "in_xxxxx",
          customer: "cus_xxxxx",
          subscription: "sub_xxxxx",
          amount_paid: 999,
          currency: "eur",
          period_end: "2024-02-28"
        }
      }
    },
    action: "UPDATE subscriptions SET period_end = invoice.period_end",
    consequence: "L'abbonamento è stato rinnovato per un altro mese."
  },
  {
    id: '3',
    type: 'invoice.payment_failed',
    description: 'Pagamento fallito. Notifica l\'utente e riprova.',
    importance: 'critical',
    payload: {
      id: "evt_5555555555",
      type: "invoice.payment_failed",
      data: {
        object: {
          id: "in_xxxxx",
          customer: "cus_xxxxx",
          attempt_count: 1,
          next_payment_attempt: "2024-01-18T10:00:00Z",
          last_finalization_error: {
            code: "card_declined",
            message: "Your card was declined."
          }
        }
      }
    },
    action: "sendEmail(customer.email, 'Pagamento fallito')",
    consequence: "Stripe riproverà il pagamento. L'utente riceve una notifica."
  },
  {
    id: '4',
    type: 'customer.subscription.deleted',
    description: 'Abbonamento cancellato. Rimuovi accesso premium.',
    importance: 'critical',
    payload: {
      id: "evt_6666666666",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_xxxxx",
          customer: "cus_xxxxx",
          status: "canceled",
          canceled_at: "2024-01-15T15:30:00Z",
          cancellation_details: {
            reason: "customer_request"
          }
        }
      }
    },
    action: "UPDATE users SET plan = 'free' WHERE stripe_customer_id = customer",
    consequence: "L'utente torna al piano gratuito. Accesso premium revocato."
  },
  {
    id: '5',
    type: 'customer.subscription.updated',
    description: 'Piano cambiato (upgrade/downgrade).',
    importance: 'important',
    payload: {
      id: "evt_7777777777",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_xxxxx",
          customer: "cus_xxxxx",
          items: {
            data: [{ price: { id: "price_premium_annual" } }]
          },
          status: "active"
        },
        previous_attributes: {
          items: {
            data: [{ price: { id: "price_premium_monthly" } }]
          }
        }
      }
    },
    action: "UPDATE users SET plan_type = newPlan WHERE stripe_customer_id = customer",
    consequence: "Il piano dell'utente è stato aggiornato."
  },
  {
    id: '6',
    type: 'customer.created',
    description: 'Nuovo cliente creato in Stripe.',
    importance: 'info',
    payload: {
      id: "evt_8888888888",
      type: "customer.created",
      data: {
        object: {
          id: "cus_newxxxxx",
          email: "nuovo@example.com",
          created: 1705320000,
          metadata: { userId: "user_456" }
        }
      }
    },
    action: "UPDATE users SET stripe_customer_id = customer.id WHERE id = metadata.userId",
    consequence: "Il customer ID di Stripe è salvato nel database."
  },
];

const importanceColors = {
  critical: 'bg-destructive text-destructive-foreground',
  important: 'bg-warning text-warning-foreground',
  info: 'bg-primary text-primary-foreground',
};

const importanceLabels = {
  critical: 'Critico',
  important: 'Importante', 
  info: 'Info',
};

// Simulazione del flusso webhook
interface SimulationStep {
  id: number;
  actor: 'stripe' | 'network' | 'server' | 'database';
  label: string;
  description: string;
}

const simulationSteps: SimulationStep[] = [
  { id: 1, actor: 'stripe', label: 'Stripe', description: 'Evento generato e webhook inviato' },
  { id: 2, actor: 'network', label: 'HTTPS POST', description: 'Richiesta HTTP sicura al tuo endpoint' },
  { id: 3, actor: 'server', label: 'Server', description: 'Verifica firma e processa evento' },
  { id: 4, actor: 'database', label: 'Database', description: 'Aggiornamento dati utente' },
];

export function WebhookExplainer() {
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationProgress, setSimulationProgress] = useState(0);

  // Simula la ricezione di un webhook
  const simulateWebhook = async (event: WebhookEvent) => {
    setSelectedEvent(event);
    setIsSimulating(true);
    setSimulationStep(0);
    setSimulationProgress(0);

    // Anima ogni step
    for (let i = 1; i <= simulationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSimulationStep(i);
      setSimulationProgress((i / simulationSteps.length) * 100);
    }

    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setSelectedEvent(null);
    setIsSimulating(false);
    setSimulationStep(0);
    setSimulationProgress(0);
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-warning/10 text-warning">
            <Zap className="w-4 h-4 mr-1" />
            Comunicazione Asincrona
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            🔔 Perché i Webhook sono Essenziali?
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            I webhook permettono a Stripe di notificare il tuo server quando 
            avvengono eventi importanti, <strong>anche quando l'utente non è sul tuo sito</strong>.
          </p>
        </motion.div>

        {/* Spiegazione visiva - Senza vs Con webhook */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Senza Webhook */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-6 h-6" />
                  Senza Webhook: Problemi! ❌
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Se ti affidi <strong>solo alla redirect</strong> dopo il pagamento:
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: X, text: 'L\'utente chiude il browser prima della redirect' },
                    { icon: X, text: 'Problemi di rete interrompono la connessione' },
                    { icon: X, text: 'Il pagamento viene processato dopo la redirect' },
                    { icon: X, text: 'Rinnovi automatici senza l\'utente presente' },
                    { icon: X, text: 'Cancellazioni fatte dalla dashboard Stripe' },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 text-destructive/80"
                    >
                      <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
                
                {/* Diagramma visivo del problema */}
                <div className="mt-6 p-4 bg-destructive/5 rounded-lg">
                  <p className="text-sm font-medium mb-3">Scenario problematico:</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-col items-center">
                      <User className="w-8 h-8 text-muted-foreground" />
                      <span className="mt-1">Utente</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-col items-center">
                      <CreditCard className="w-8 h-8 text-primary" />
                      <span className="mt-1">Paga</span>
                    </div>
                    <div className="flex flex-col items-center text-destructive">
                      <X className="w-8 h-8" />
                      <span className="mt-1">Chiude!</span>
                    </div>
                    <div className="flex flex-col items-center opacity-50">
                      <Server className="w-8 h-8" />
                      <span className="mt-1">Server?</span>
                    </div>
                  </div>
                  <p className="text-xs text-destructive mt-3 text-center">
                    Il server non sa che il pagamento è avvenuto! 😱
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Con Webhook */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="w-6 h-6" />
                  Con Webhook: Tutto Funziona! ✅
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  I webhook garantiscono che il tuo sistema sia <strong>sempre sincronizzato</strong>:
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: Shield, text: 'Comunicazione sicura e verificata con firma' },
                    { icon: RefreshCw, text: 'Retry automatico in caso di errori (fino a 72h)' },
                    { icon: Clock, text: 'Notifiche in tempo reale degli eventi' },
                    { icon: MessageSquare, text: 'Gestione eventi anche quando l\'utente è offline' },
                    { icon: Zap, text: 'Automazione completa del flusso di pagamento' },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 text-accent"
                    >
                      <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Diagramma visivo della soluzione */}
                <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                  <p className="text-sm font-medium mb-3">Con i webhook:</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-col items-center">
                      <CreditCard className="w-8 h-8 text-primary" />
                      <span className="mt-1">Stripe</span>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </motion.div>
                    <div className="flex flex-col items-center">
                      <Zap className="w-8 h-8 text-warning" />
                      <span className="mt-1">Webhook</span>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    >
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </motion.div>
                    <div className="flex flex-col items-center">
                      <Server className="w-8 h-8 text-accent" />
                      <span className="mt-1">Server</span>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                    >
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </motion.div>
                    <div className="flex flex-col items-center">
                      <Database className="w-8 h-8 text-accent" />
                      <span className="mt-1">DB</span>
                    </div>
                  </div>
                  <p className="text-xs text-accent mt-3 text-center">
                    Il server viene SEMPRE notificato! 🎉
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Simulazione Interattiva */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            🎮 Simulazione Interattiva
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Clicca su un evento per vedere come viene processato dal server
          </p>

          {/* Visualizzazione del flusso */}
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Flusso del Webhook</h3>
                {selectedEvent && (
                  <Button variant="ghost" size="sm" onClick={resetSimulation}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>

              {/* Progress bar */}
              <Progress value={simulationProgress} className="mb-6 h-2" />

              {/* Steps visualizzazione */}
              <div className="grid grid-cols-4 gap-4">
                {simulationSteps.map((step) => (
                  <motion.div
                    key={step.id}
                    className={`p-4 rounded-xl text-center transition-all ${
                      simulationStep >= step.id
                        ? 'bg-accent/20 border-2 border-accent'
                        : 'bg-muted/50 border-2 border-transparent'
                    }`}
                    animate={simulationStep === step.id ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      simulationStep >= step.id ? 'bg-accent text-accent-foreground' : 'bg-muted'
                    }`}>
                      {step.actor === 'stripe' && <CreditCard className="w-6 h-6" />}
                      {step.actor === 'network' && <Zap className="w-6 h-6" />}
                      {step.actor === 'server' && <Server className="w-6 h-6" />}
                      {step.actor === 'database' && <Database className="w-6 h-6" />}
                    </div>
                    <p className="font-medium text-sm">{step.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {simulationStep >= step.id ? step.description : '...'}
                    </p>
                    {simulationStep === step.id && isSimulating && (
                      <motion.div
                        className="mt-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <Badge variant="outline" className="text-xs">
                          In corso...
                        </Badge>
                      </motion.div>
                    )}
                    {simulationStep > step.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-accent mx-auto" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Dettaglio evento selezionato */}
              <AnimatePresence>
                {selectedEvent && simulationStep >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 grid md:grid-cols-2 gap-4"
                  >
                    {/* Payload ricevuto */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Payload Ricevuto
                      </h4>
                      <pre className="bg-code-bg text-code-text p-4 rounded-lg text-xs overflow-x-auto max-h-48">
                        <code>{JSON.stringify(selectedEvent.payload, null, 2)}</code>
                      </pre>
                    </div>
                    
                    {/* Azione eseguita */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Azione del Server
                      </h4>
                      <div className="bg-code-bg text-code-text p-4 rounded-lg text-xs mb-4">
                        <code>{selectedEvent.action}</code>
                      </div>
                      <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                        <p className="text-sm font-medium text-accent flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Risultato
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedEvent.consequence}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedEvent && (
                <p className="text-center text-muted-foreground mt-4">
                  👇 Clicca su un evento qui sotto per avviare la simulazione
                </p>
              )}
            </CardContent>
          </Card>

          {/* Eventi Webhook */}
          <h3 className="text-xl font-bold text-center mb-6">
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
                  className={`cursor-pointer transition-all h-full ${
                    selectedEvent?.id === event.id 
                      ? 'ring-2 ring-accent bg-accent/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => simulateWebhook(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <code className="text-sm font-mono text-primary break-all">
                        {event.type}
                      </code>
                      <Badge className={`${importanceColors[event.importance]} text-xs flex-shrink-0`}>
                        {importanceLabels[event.importance]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {event.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      disabled={isSimulating}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Simula
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Codice esempio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-code-bg text-code-text overflow-hidden">
            <CardHeader className="border-b border-border/20">
              <CardTitle className="text-code-text flex items-center gap-2">
                <Server className="w-5 h-5" />
                Esempio Completo: Handler Webhook in Node.js
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="p-6 text-sm overflow-x-auto">
                <code>{`// 📁 routes/webhook.js - Endpoint webhook nel tuo backend

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ⚠️ IMPORTANTE: Il body deve essere RAW, non JSON!
app.post('/webhook/stripe', 
  express.raw({ type: 'application/json' }), 
  async (req, res) => {
    
    // 1️⃣ VERIFICA LA FIRMA DEL WEBHOOK
    // Questo è FONDAMENTALE per la sicurezza!
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log('✅ Firma webhook verificata');
    } catch (err) {
      console.error('❌ Errore verifica firma:', err.message);
      return res.status(400).send(\`Webhook Error: \${err.message}\`);
    }
    
    // 2️⃣ GESTISCI I DIVERSI TIPI DI EVENTI
    try {
      switch (event.type) {
        
        case 'checkout.session.completed':
          // 🎉 Pagamento riuscito! Attiva il piano premium
          const session = event.data.object;
          const userId = session.metadata.userId;
          
          await db.users.update({
            where: { id: userId },
            data: { 
              plan: 'premium',
              stripeCustomerId: session.customer,
              subscriptionId: session.subscription
            }
          });
          console.log(\`✅ Utente \${userId} aggiornato a premium\`);
          break;
          
        case 'invoice.payment_succeeded':
          // 💰 Rinnovo riuscito
          console.log('💰 Pagamento rinnovo riuscito');
          break;
          
        case 'invoice.payment_failed':
          // ⚠️ Pagamento fallito - notifica l'utente
          const invoice = event.data.object;
          await sendPaymentFailedEmail(invoice.customer_email);
          console.log('⚠️ Pagamento fallito, email inviata');
          break;
          
        case 'customer.subscription.deleted':
          // 🔒 Abbonamento cancellato
          const sub = event.data.object;
          await db.users.update({
            where: { stripeCustomerId: sub.customer },
            data: { plan: 'free', subscriptionId: null }
          });
          console.log('🔒 Abbonamento cancellato');
          break;
          
        default:
          console.log(\`ℹ️ Evento non gestito: \${event.type}\`);
      }
    } catch (error) {
      console.error('❌ Errore processamento:', error);
      // ⚠️ Ritorna 200 comunque per evitare retry inutili
      // se l'errore è nel tuo codice
    }
    
    // 3️⃣ RISPONDI SEMPRE CON 200
    // Stripe considererà il webhook "consegnato"
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

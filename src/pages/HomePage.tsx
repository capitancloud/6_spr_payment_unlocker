/**
 * 🏠 PAGINA HOME
 * 
 * Introduzione all'app educativa con overview delle sezioni.
 */

import { motion } from 'framer-motion';
import { CreditCard, Zap, Crown, Code2, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const sections = [
  {
    title: 'Flusso di Pagamento',
    description: 'Segui passo dopo passo il percorso completo di un pagamento Stripe, dal click dell\'utente fino all\'attivazione premium.',
    icon: CreditCard,
    color: 'text-primary',
    bg: 'bg-primary/10',
    path: '/payment-flow',
  },
  {
    title: 'Webhook',
    description: 'Scopri perché i webhook sono essenziali per la comunicazione asincrona tra Stripe e il tuo server.',
    icon: Zap,
    color: 'text-warning',
    bg: 'bg-warning/10',
    path: '/webhooks',
  },
  {
    title: 'Piani & Prezzi',
    description: 'Simula un checkout completo e passa dal piano gratuito a premium con un\'animazione interattiva.',
    icon: Crown,
    color: 'text-accent',
    bg: 'bg-accent/10',
    path: '/pricing',
  },
  {
    title: 'Funzionalità Premium',
    description: 'Vedi come funziona un paywall e come sbloccare funzionalità dopo il pagamento.',
    icon: Sparkles,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    path: '/features',
  },
  {
    title: 'Codice Sorgente',
    description: 'Esplora esempi di codice commentati per frontend e backend con consigli pratici.',
    icon: Code2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    path: '/code',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-6 bg-primary/10 text-primary px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              App Educativa Interattiva
            </Badge>
          </motion.div>

          {/* Titolo */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent"
          >
            Payment Unlocker
          </motion.h1>

          {/* Sottotitolo */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Impara come funzionano i pagamenti online con 
            <span className="text-primary font-semibold"> simulazioni interattive </span>
            di Stripe, webhook e abbonamenti
          </motion.p>

          {/* Icone animate */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-6 mb-10"
          >
            {[
              { icon: CreditCard, label: 'Pagamenti' },
              { icon: Zap, label: 'Webhook' },
              { icon: Crown, label: 'Premium' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center gap-2"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, delay: index * 0.2, repeat: Infinity }}
              >
                <div className="p-3 rounded-xl bg-card shadow-lg border">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/payment-flow')}
              className="text-lg px-8 py-6 rounded-2xl"
            >
              Inizia il Tutorial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            ✨ Nessun pagamento reale - È tutto simulato!
          </motion.p>
        </div>
      </section>

      {/* Sezioni */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            Cosa Imparerai
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card 
                  className="h-full cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                  onClick={() => navigate(section.path)}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${section.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <section.icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {section.description}
                    </p>
                    <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      Esplora <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

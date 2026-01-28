/**
 * 🎯 HERO SECTION
 * 
 * La sezione principale che introduce l'utente all'app educativa.
 * Mostra un'animazione accattivante e invita a esplorare.
 */

import { motion } from 'framer-motion';
import { CreditCard, Zap, BookOpen, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStartLearning: () => void;
}

export function HeroSection({ onStartLearning }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background">
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">App Educativa Interattiva</span>
          </motion.div>

          {/* Titolo principale */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 pb-2 bg-gradient-primary bg-clip-text text-transparent leading-tight"
          >
            Payment Unlocker
          </motion.h1>

          {/* Sottotitolo */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Impara come funzionano i pagamenti online con una 
            <span className="text-primary font-semibold"> simulazione interattiva </span>
            di Stripe, webhook e abbonamenti
          </motion.p>

          {/* Icone animate */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-8 mb-12"
          >
            {[
              { icon: CreditCard, label: 'Pagamenti', color: 'text-primary' },
              { icon: Zap, label: 'Webhook', color: 'text-secondary' },
              { icon: BookOpen, label: 'Tutorial', color: 'text-accent' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center gap-2"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, delay: index * 0.2, repeat: Infinity }}
              >
                <div className={`p-4 rounded-2xl bg-card shadow-lg ${item.color}`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              size="lg"
              onClick={onStartLearning}
              className="group text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
            >
              Inizia ad Imparare
              <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Info aggiuntiva */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            ✨ Nessun pagamento reale richiesto - È tutto simulato!
          </motion.p>
        </div>
      </div>
    </section>
  );
}

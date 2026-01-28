/**
 * 🦶 FOOTER
 * 
 * Footer semplice con informazioni sull'app educativa.
 */

import { motion } from 'framer-motion';
import { Heart, Github, BookOpen, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 bg-muted/50 border-t">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <CreditCard className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Payment Unlocker</span>
          </div>

          {/* Descrizione */}
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Un'app educativa per imparare come funzionano i pagamenti online 
            con Stripe. Tutto è simulato - nessun pagamento reale!
          </p>

          {/* Link */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <a 
              href="#payment-flow" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" />
              Flusso Pagamento
            </a>
            <a 
              href="#webhooks" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Webhook
            </a>
            <a 
              href="#pricing" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Piani
            </a>
            <a 
              href="#code" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Codice
            </a>
          </div>

          {/* Disclaimer */}
          <div className="inline-block px-4 py-2 bg-warning/10 text-warning rounded-lg text-sm mb-8">
            ⚠️ Questa è una simulazione educativa. Nessun pagamento reale viene elaborato.
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Creato con <Heart className="w-4 h-4 text-destructive" /> per scopi educativi
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

/**
 * ✨ FUNZIONALITÀ PREMIUM
 * 
 * Questo componente mostra le funzionalità sbloccate con il piano premium.
 * Dimostra visivamente il concetto di "paywall" e sblocco contenuti.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, Unlock, Crown, Download, Award, 
  Code2, BookOpen, MessageCircle, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePayment } from '@/contexts/PaymentContext';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: typeof Lock;
  isPremium: boolean;
}

const features: Feature[] = [
  {
    id: 'docs',
    title: 'Documentazione Base',
    description: 'Guida introduttiva ai pagamenti online e concetti fondamentali.',
    icon: BookOpen,
    isPremium: false,
  },
  {
    id: 'diagrams',
    title: 'Diagrammi Interattivi',
    description: 'Visualizza il flusso di pagamento passo dopo passo.',
    icon: Sparkles,
    isPremium: false,
  },
  {
    id: 'code',
    title: 'Codice Sorgente Completo',
    description: 'Scarica il codice di esempio pronto da usare nei tuoi progetti.',
    icon: Code2,
    isPremium: true,
  },
  {
    id: 'quizzes',
    title: 'Quiz e Certificazioni',
    description: 'Testa le tue conoscenze e ottieni certificati verificabili.',
    icon: Award,
    isPremium: true,
  },
  {
    id: 'projects',
    title: 'Progetti Pratici',
    description: 'Progetti guidati per implementare pagamenti reali.',
    icon: Download,
    isPremium: true,
  },
  {
    id: 'support',
    title: 'Supporto Prioritario',
    description: 'Assistenza dedicata per risolvere i tuoi dubbi.',
    icon: MessageCircle,
    isPremium: true,
  },
];

export function PremiumFeatures() {
  const { state } = usePayment();
  const navigate = useNavigate();
  const isPremium = state.plan === 'premium';

  return (
    <section className="py-20 bg-background" id="features">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4 mr-1" />
            Funzionalità
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isPremium ? '🎉 Hai Sbloccato Tutto!' : '🔒 Sblocca le Funzionalità Premium'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isPremium 
              ? 'Ora hai accesso completo a tutte le risorse educative!'
              : 'Passa al piano Premium per accedere a tutte le funzionalità avanzate.'
            }
          </p>
        </motion.div>

        {/* Griglia Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const isLocked = feature.isPremium && !isPremium;
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full transition-all duration-300 ${
                    isLocked 
                      ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' 
                      : 'hover:shadow-lg hover:border-primary/50'
                  } ${
                    feature.isPremium && isPremium 
                      ? 'ring-2 ring-accent/50 bg-accent/5' 
                      : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${
                        isLocked 
                          ? 'bg-muted' 
                          : feature.isPremium 
                          ? 'bg-gradient-premium' 
                          : 'bg-primary/10'
                      }`}>
                        <feature.icon className={`w-6 h-6 ${
                          isLocked 
                            ? 'text-muted-foreground' 
                            : feature.isPremium 
                            ? 'text-foreground' 
                            : 'text-primary'
                        }`} />
                      </div>
                      
                      {/* Badge stato */}
                      <AnimatePresence mode="wait">
                        {isLocked ? (
                          <motion.div
                            key="locked"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Badge variant="outline" className="gap-1">
                              <Lock className="w-3 h-3" />
                              Bloccato
                            </Badge>
                          </motion.div>
                        ) : feature.isPremium ? (
                          <motion.div
                            key="unlocked"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Badge className="gap-1 bg-accent text-accent-foreground">
                              <Unlock className="w-3 h-3" />
                              Sbloccato
                            </Badge>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                    
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    
                    {/* Pulsante azione */}
                    <Button 
                      variant={isLocked ? "outline" : "default"}
                      className={`w-full ${!isLocked && feature.isPremium ? 'bg-accent hover:bg-accent/90' : ''}`}
                      disabled={isLocked}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Richiede Premium
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Accedi
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA per utenti free */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                Pronto a sbloccare tutto?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Passa a Premium e accedi a tutte le funzionalità educative, 
                inclusi progetti pratici e certificazioni!
              </p>
              <Button 
                size="lg"
                className="bg-gradient-premium text-foreground hover:opacity-90"
                onClick={() => navigate('/pricing')}
              >
                <Crown className="w-5 h-5 mr-2" />
                Vai ai Piani
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Celebrazione per utenti premium */}
        <AnimatePresence>
          {isPremium && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-16 text-center"
            >
              <Card className="inline-block p-8 bg-accent/10 border-accent">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-accent">
                  🎉 Sei un utente Premium!
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Hai sbloccato tutte le funzionalità. In un'app reale, questo stato 
                  sarebbe salvato nel database e sincronizzato tramite webhook!
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

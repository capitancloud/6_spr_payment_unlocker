/**
 * 📐 LAYOUT PRINCIPALE
 * 
 * Layout con sidebar per la navigazione tra le sezioni.
 */

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePayment } from "@/contexts/PaymentContext";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { state } = usePayment();
  const isPremium = state.plan === 'premium';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:block">
                Impara i pagamenti online
              </span>
            </div>
            
            {/* Status badge */}
            {isPremium ? (
              <Badge className="bg-gradient-premium text-foreground gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                Piano Gratuito
              </Badge>
            )}
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

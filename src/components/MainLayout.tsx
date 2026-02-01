/**
 * 📐 LAYOUT PRINCIPALE
 * 
 * Layout con sidebar per la navigazione tra le sezioni.
 */

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePayment } from "@/contexts/PaymentContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, LogOut } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { state } = usePayment();
  const { logout } = useAuth();
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
            
            {/* Status badge e logout */}
            <div className="flex items-center gap-3">
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
              
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Logout"
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
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

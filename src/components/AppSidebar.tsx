/**
 * 🧭 SIDEBAR DELL'APP
 * 
 * Navigazione principale tra le diverse sezioni educative.
 */

import { 
  CreditCard, Zap, Crown, Code2, BookOpen, Home, Sparkles
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { 
    title: "Home", 
    url: "/", 
    icon: Home,
    description: "Introduzione"
  },
  { 
    title: "Flusso Pagamento", 
    url: "/payment-flow", 
    icon: CreditCard,
    description: "Simulazione interattiva"
  },
  { 
    title: "Webhook", 
    url: "/webhooks", 
    icon: Zap,
    description: "Comunicazione asincrona"
  },
  { 
    title: "Piani & Prezzi", 
    url: "/pricing", 
    icon: Crown,
    description: "Simulazione checkout"
  },
  { 
    title: "Funzionalità Premium", 
    url: "/features", 
    icon: Sparkles,
    description: "Paywall & sblocco"
  },
  { 
    title: "Codice Sorgente", 
    url: "/code", 
    icon: Code2,
    description: "Esempi commentati"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">Payment Unlocker</h1>
              <p className="text-xs text-muted-foreground">App Educativa</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Navigazione"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <NavLink 
                        to={item.url} 
                        end 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex flex-col">
                            <span>{item.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Info box */}
        {!collapsed && (
          <div className="p-4 mt-auto">
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">Nota</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Questa è una simulazione educativa. Nessun pagamento reale!
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

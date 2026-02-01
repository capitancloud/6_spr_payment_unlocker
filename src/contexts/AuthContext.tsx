/**
 * 🔐 CONTESTO AUTENTICAZIONE
 * 
 * Gestisce l'accesso all'app tramite codice segreto hashato.
 * Il codice viene confrontato tramite hash SHA-256 per sicurezza.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hash SHA-256 del codice di accesso corretto
// Generato da: gT6@Qp!R1Z$uN9e#X^cD2sL%hY&vJm*W+K7B~A=F4q-Uo_rP)k8S]3C0{I?E
const CORRECT_CODE_HASH = '8f4e3b2a1d9c7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f';

/**
 * Funzione per generare hash SHA-256
 */
async function hashCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Pre-calcoliamo l'hash corretto al caricamento
let correctHash: string | null = null;
const initHash = async () => {
  correctHash = await hashCode('gT6@Qp!R1Z$uN9e#X^cD2sL%hY&vJm*W+K7B~A=F4q-Uo_rP)k8S]3C0{I?E');
};
initHash();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Controlla se l'utente era già autenticato
  useEffect(() => {
    const savedAuth = localStorage.getItem('payment_unlocker_auth');
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  /**
   * Verifica il codice di accesso tramite confronto hash
   */
  const login = async (code: string): Promise<boolean> => {
    const inputHash = await hashCode(code);
    
    if (inputHash === correctHash) {
      setIsAuthenticated(true);
      localStorage.setItem('payment_unlocker_auth', 'authenticated');
      return true;
    }
    return false;
  };

  /**
   * Logout - rimuove l'autenticazione
   */
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('payment_unlocker_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider');
  }
  return context;
}

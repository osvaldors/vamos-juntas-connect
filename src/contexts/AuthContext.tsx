import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = useCallback(async (userId: string) => {
    try {
      const query = supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      // 5-second timeout using Promise.race
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
      const result = await Promise.race([query, timeout]);

      // If timeout won, result is null (not a Supabase response)
      if (result && typeof result === 'object' && 'data' in result) {
        setIsAdmin(!!result.data);
      } else {
        console.warn("[AuthContext] checkAdmin timed out");
        setIsAdmin(false);
      }
    } catch (err) {
      console.warn("[AuthContext] Erro ao verificar admin:", err);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let resolved = false;

    const finishLoading = () => {
      if (mounted && !resolved) {
        resolved = true;
        setLoading(false);
      }
    };

    // Safety timeout — NEVER let auth block the UI for more than 5 seconds
    const safetyTimer = setTimeout(() => {
      if (!resolved) {
        console.warn("[AuthContext] Auth initialization timed out — unblocking UI");
        finishLoading();
      }
    }, 5000);

    // 1. Set up the auth state listener FIRST (Supabase best practice)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock with concurrent requests during init
          setTimeout(async () => {
            if (mounted) {
              await checkAdmin(session.user.id);
              finishLoading();
            }
          }, 0);
        } else {
          setIsAdmin(false);
          finishLoading();
        }
      }
    );

    // 2. Then get the initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await checkAdmin(session.user.id);
      }
      finishLoading();
    }).catch((err) => {
      console.warn("[AuthContext] Erro ao obter sessão:", err);
      if (mounted) {
        // Clear potentially corrupted auth data from localStorage
        try {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              console.warn("[AuthContext] Clearing stale auth token:", key);
              localStorage.removeItem(key);
            }
          });
        } catch (e) {
          // ignore localStorage errors
        }
        finishLoading();
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [checkAdmin]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out error (ignored):", e);
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

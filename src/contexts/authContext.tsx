import type { User, Session } from "@supabase/supabase-js";
import supabase from "../lib/supabase";
import { createContext, useEffect, useState } from "react";

interface AuthContextType {
  session: Session | null | undefined;
  user: User | null | undefined;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setSession(session);
      setUser(session?.user);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
      }
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, user, signOut: () => supabase.auth.signOut() }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

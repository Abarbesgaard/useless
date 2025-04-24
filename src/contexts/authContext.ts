import { createContext } from "react";
import type { User, Session } from "@supabase/supabase-js";

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

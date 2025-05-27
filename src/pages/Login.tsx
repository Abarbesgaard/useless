import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../lib/supabase";
import { Github, Linkedin } from "lucide-react";
import { ModeToggle } from "@/components/custom/ModeToggle";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome to Strackly
        </h1>

        <div className="w-full bg-card border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-center mb-2">Login</h2>
          <p className="text-center text-muted-foreground mb-6">
            Please login to continue
          </p>

          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
          />
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 mt-2">
            <a
              href="https://github.com/Abarbesgaard/useless"
              className="flex items-center gap-2 hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/andreasbarbesgaard/"
              className="flex items-center gap-2 hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

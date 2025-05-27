import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "@/lib/supabase";
import { Github, Linkedin } from "lucide-react";
import logo from "@/assets/logo_vector.svg";

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-muted/30 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-chart-4/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        {/* Logo/Brand section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src={logo} alt="Strackly Logo" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Strackly
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your career journey
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="w-full bg-card/80 backdrop-blur-lg border border-border/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to continue your job search journey
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(var(--primary))",
                    brandAccent: "hsl(var(--primary))",
                    brandButtonText: "hsl(var(--primary-foreground))",
                    inputText: "hsl(var(--foreground))",
                    inputBackground: "hsl(var(--background))",
                    inputBorder: "hsl(var(--border))",
                    inputLabelText: "hsl(var(--foreground))",
                    inputPlaceholder: "hsl(var(--muted-foreground))",
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Made with ❤️ by Andreas
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/Abarbesgaard/useless"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/andreasbarbesgaard/"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

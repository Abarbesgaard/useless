import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../lib/supabase"; // your initialized client
import { Github, Linkedin } from "lucide-react";
export default function Login() {
  return (
    <>
      <div>
        <h1 className="text-3xl">Welcome to UseLess</h1>

        <h1 className="text-2xl font-bold text-center mt-10">Login</h1>
        <p className="text-center mt-2">Please login to continue</p>
      </div>

      <div className="flex items-center justify-center mt-6">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>

      <div className="text-center mt-6 space-y-2">
        <p className="text-sm"></p>
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/Abarbesgaard/useless"
            className="flex items-center gap-2 text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/andreasbarbesgaard/"
            className="flex items-center gap-2 text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </a>
        </div>
      </div>
    </>
  );
}
